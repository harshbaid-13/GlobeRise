import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await registerAuth({
        email: data.email,
        password: data.password,
        username: data.username,
      });
      setSuccess('Registration successful! Please verify your email.');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1421] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-[#00d4ff] hover:text-[#3b82f6]">
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
          
          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              error={errors.username?.message}
              required
              {...register('username')}
            />
            
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
            
            <Input
              label="Confirm Password"
              type="password"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-[#00d4ff] focus:ring-[#00d4ff] border-[#374151] rounded bg-[#252a3a]"
              {...register('termsAccepted')}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-[#00d4ff] hover:text-[#3b82f6]">
                terms and conditions
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-[#ef4444]">{errors.termsAccepted.message}</p>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loading size="sm" /> : 'Register'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

