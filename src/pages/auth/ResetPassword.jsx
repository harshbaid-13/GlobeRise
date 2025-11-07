import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { resetPasswordSchema } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

const ResetPassword = () => {
  const { token } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Validate token (in real app, check with backend)
    if (token) {
      setValidToken(true);
    }
  }, [token]);

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1421]">
        <Alert type="error" message="Invalid or expired reset token." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1421] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your new password below.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}
          {success && (
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
          )}
          
          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              error={errors.password?.message}
              required
              {...register('password')}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loading size="sm" /> : 'Reset Password'}
            </Button>
          </div>
          
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-[#00d4ff] hover:text-[#3b82f6]"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

