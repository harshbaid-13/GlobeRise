import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { twoFactorSchema } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

const TwoFactorAuth = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(twoFactorSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.verify2FA(data.code);
      // Redirect based on user role (would come from context)
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      setError(err.message || 'Invalid 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1421] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}
          
          <div>
            <Input
              label="2FA Code"
              type="text"
              placeholder="000000"
              maxLength={6}
              error={errors.code?.message}
              required
              className="text-center text-2xl tracking-widest"
              {...register('code')}
            />
            <p className="mt-2 text-sm text-gray-400 text-center">
              Enter any 6-digit code for demo purposes
            </p>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loading size="sm" /> : 'Verify'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;

