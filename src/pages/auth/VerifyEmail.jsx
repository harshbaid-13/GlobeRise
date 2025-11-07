import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTES } from '../../utils/constants';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Invalid verification token');
        setLoading(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err.message || 'Email verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1421]">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1421] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {success ? (
          <>
            <div className="text-[#10b981] text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-extrabold text-white">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Your email has been verified. You can now log in to your account.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate(ROUTES.LOGIN)} className="w-full">
                Go to Login
              </Button>
            </div>
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
                className="block text-center text-sm font-medium text-[#00d4ff] hover:text-[#3b82f6]"
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

