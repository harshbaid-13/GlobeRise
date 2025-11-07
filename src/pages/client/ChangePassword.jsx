import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const ChangePassword = () => {
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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

