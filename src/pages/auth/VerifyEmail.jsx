import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, STORAGE_KEYS } from '../../utils/constants';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const VerifyEmail = () => {
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Invalid verification token');
        setLoading(false);
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        const { user, token: authToken, refreshToken } = response || {};

        // If tokens are provided, store them and authenticate user
        if (authToken && user) {
          // Normalize role
          const normalizedUser = { ...user };
          if (normalizedUser.role === 'USER') normalizedUser.role = 'client';
          if (normalizedUser.role === 'ADMIN') normalizedUser.role = 'admin';
          normalizedUser.role = normalizedUser.role.toLowerCase();

          // Store tokens and user
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
          if (refreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
          }
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));

          // Update auth context
          await refreshUser();
          setIsAuthenticated(true);
          setSuccess(true);

          // Redirect to appropriate dashboard
          setTimeout(() => {
            if (normalizedUser.role === 'admin') {
              navigate(ROUTES.ADMIN_DASHBOARD);
            } else {
              navigate(ROUTES.CLIENT_DASHBOARD);
            }
          }, 1500);
        } else {
          // No tokens, just show success message
          setSuccess(true);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Email verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831]">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {success ? (
          <>
            <div className="text-[#10b981] text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-extrabold text-white">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isAuthenticated
                ? 'Your email has been verified. Redirecting to your dashboard...'
                : 'Your email has been verified. You can now log in to your account.'}
            </p>
            {!isAuthenticated && (
              <div className="mt-6">
                <Button onClick={() => navigate(ROUTES.LOGIN)} className="w-full">
                  Go to Login
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-[#ef4444] text-6xl mb-4">✗</div>
            <h2 className="text-3xl font-extrabold text-white">
              Verification Failed
            </h2>
            <Alert type="error" message={error} className="mt-4" />
            <div className="mt-6 space-y-2">
              <Button onClick={() => navigate(ROUTES.RESEND_EMAIL)} className="w-full">
                Resend Verification Email
              </Button>
              <Link
                to={ROUTES.LOGIN}
                className="block text-center text-sm font-medium text-[#00ADB5] hover:text-[#00ADB5]"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

