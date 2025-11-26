import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Alert from '../../components/common/Alert';
import { FaUser } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Client';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-sm text-gray-400">
          Manage your account information and keep your details up to date.
        </p>
      </div>

      <div className="bg-[#393E46] border border-[#4b5563] rounded-xl shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Profile summary */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#00ADB5] flex items-center justify-center shadow-md">
              <FaUser className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left space-y-1">
              <p className="text-lg font-semibold text-white">
                {name || user?.name || user?.username || 'User'}
              </p>
              <p className="text-sm text-gray-300">{user?.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/40 mt-2">
                {roleLabel}
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <Alert type="error" message={error} />}
              {success && <Alert type="success" message={success} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={user?.username || ''}
                  disabled
                />
                <Input
                  label="Email"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

