import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCodeFromUrl = searchParams.get('ref');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Pre-fill referral code from URL parameter
  useEffect(() => {
    if (refCodeFromUrl) {
      setValue('referralCode', refCodeFromUrl.toUpperCase());
    }
  }, [refCodeFromUrl, setValue]);

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      // Only include referralCode if it's provided
      if (data.referralCode && data.referralCode.trim()) {
        payload.referralCode = data.referralCode.trim().toUpperCase();
      }

      const result = await registerAuth(payload);
      setSuccess('Registration successful! Please check your email to verify your account.');
      
      // Add link to resend email page
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222831] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-[#00ADB5] hover:text-[#00ADB5]">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}
          {success && (
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
          )}

          <div>
            <GoogleSignInButton />
            <p className="mt-2 text-xs text-center text-gray-500">
              Google sign-in automatically verifies your email
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#222831] text-gray-400">Or register with email</span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />

            <Input
              label="Referral Code (Optional)"
              type="text"
              placeholder="Enter 8-character code"
              error={errors.referralCode?.message}
              maxLength={8}
              {...register('referralCode')}
            />
            <p className="text-xs text-gray-500 -mt-2">
              Have a referral code? Enter it above to join under your sponsor.
            </p>
          </div>

          {success && (
            <div className="text-sm text-gray-400 text-center">
              Didn't receive the email?{' '}
              <Link to={ROUTES.RESEND_EMAIL} className="text-[#00ADB5] hover:text-[#00ADB5]">
                Resend verification email
              </Link>
            </div>
          )}

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-[#00ADB5] focus:ring-[#00ADB5] border-[#4b5563] rounded bg-[#393E46]"
              {...register('termsAccepted')}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-[#00ADB5] hover:text-[#00ADB5]">
                terms and conditions
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-[#ef4444]">{errors.termsAccepted.message}</p>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loading size="sm" /> : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

