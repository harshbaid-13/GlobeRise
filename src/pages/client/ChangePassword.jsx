import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { authService } from '../../services/authService';
import { ROUTES } from '../../utils/constants';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirm password do not match');
      }

      if (currentPassword === newPassword) {
        throw new Error('New password must be different from current password');
      }

      // Call API
      await authService.changePassword(currentPassword, newPassword);

      setSuccess('Password changed successfully! You will be logged out. Please login again with your new password.');

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Change Password</h1>
        <p className="text-sm text-[var(--text-tertiary)]">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 md:p-8 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password (min. 8 characters)"
            minLength={8}
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
            minLength={8}
          />

          <Button type="submit" disabled={loading} className="w-full md:w-auto px-8">
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
