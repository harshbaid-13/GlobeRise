import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleOAuthRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    // If Google redirected here, redirect to the backend callback URL
    // The backend will process it and redirect back to /auth/callback with token
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      // OAuth error, redirect to login with error
      navigate(`/login?error=oauth_failed`);
      return;
    }

    if (code) {
      // Redirect to backend callback URL with all query parameters
      const queryString = window.location.search;
      window.location.href = `${API_URL}/auth/google/callback${queryString}`;
    } else {
      // No code, redirect to login
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, API_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831]">
      <div className="text-center">
        <p className="text-gray-400">Processing Google sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleOAuthRedirect;

