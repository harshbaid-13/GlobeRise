import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

const GoogleCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        // Check for OAuth error
        if (errorParam === 'oauth_failed' || !token) {
          setError('Google sign-in failed. Please try again.');
          setLoading(false);
          return;
        }

        // Process the token
        const result = await handleGoogleCallback(token);

        if (result && result.user) {
          // Redirect based on role
          if (result.user.role === 'admin') {
            navigate(ROUTES.ADMIN_DASHBOARD);
          } else {
            navigate(ROUTES.CLIENT_DASHBOARD);
          }
        } else {
          setError('Failed to complete authentication. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || 'Authentication failed. Please try again.');
        setLoading(false);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleGoogleCallback]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831]">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-400">Completing sign-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="text-[#ef4444] text-6xl mb-4">✗</div>
        <h2 className="text-3xl font-extrabold text-white">Authentication Failed</h2>
        <Alert type="error" message={error} className="mt-4" />
        <div className="mt-6">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full px-4 py-2.5 bg-[#00ADB5] text-white rounded-lg hover:bg-[#008c92] transition-colors font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;

