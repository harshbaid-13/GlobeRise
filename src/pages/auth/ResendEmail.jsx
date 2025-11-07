import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { resendEmailSchema } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

const ResendEmail = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resendEmailSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authService.resendEmail(data.email);
      setSuccess('Verification email has been sent. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1421] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Resend Verification Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you a new verification link.
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
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              required
              {...register('email')}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loading size="sm" /> : 'Resend Email'}
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

export default ResendEmail;

