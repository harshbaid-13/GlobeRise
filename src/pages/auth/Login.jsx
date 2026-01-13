import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for OAuth error in URL
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'oauth_failed') {
      setError('Google sign-in failed. Please try again.');
      // Clean up URL
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [searchParams, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(data.email, data.password);

      if (result.requiresTwoFactor) {
        navigate(ROUTES.TWO_FA, { state: { tempToken: result.tempToken } });
        return;
      }

      // Redirect based on role
      if (result.role === 'admin') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.CLIENT_DASHBOARD);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to={ROUTES.REGISTER} className="font-medium text-[#00ADB5] hover:text-[#00ADB5]">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              required
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#00ADB5] focus:ring-[#00ADB5] border-[#4b5563] rounded bg-[#393E46]"
                {...register('rememberMe')}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="font-medium text-[#00ADB5] hover:text-[#00ADB5]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loading size="sm" /> : 'Sign in'}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#222831] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleSignInButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

