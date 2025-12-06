import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profileService';
import { COUNTRY_CODES, COUNTRIES } from '../../utils/countryCodes';
import Alert from '../../components/common/Alert';
import AvatarPicker from '../../components/profile/AvatarPicker';
import { FaUser, FaCheckCircle } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getMyProfile();
      setProfile(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setPhone(data.phone || '');
      setPhoneCountryCode(data.phoneCountryCode || '+1');
      setAddress(data.address || '');
      setCity(data.city || '');
      setState(data.state || '');
      setZipCode(data.zipCode || '');
      setCountry(data.country || '');
      setSelectedAvatar(data.avatarUrl || null);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (emoji) => {
    setSelectedAvatar(emoji);
    // Auto-update avatar immediately
    try {
      await profileService.updateProfile({
        avatarUrl: emoji
      });
      setSuccess('Avatar updated successfully!');
      await loadProfile(); // Refresh profile
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await profileService.updateProfile({
        firstName,
        lastName,
        phone,
        phoneCountryCode,
        address,
        city,
        state,
        zipCode,
        country,
        avatarUrl: selectedAvatar
      });
      setSuccess('Profile updated successfully!');
      await loadProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

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
            <AvatarPicker selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} />
            <div className="text-center md:text-left space-y-1">
              <p className="text-lg font-semibold text-white">
                {firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || user?.name || user?.username || 'User'}
              </p>
              <p className="text-sm text-gray-300">{profile?.email || user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/40">
                  {roleLabel}
                </span>
                {profile?.emailVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/40">
                    <FaCheckCircle className="mr-1" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <Alert type="error" message={error} />}
              {success && <Alert type="success" message={success} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  value={profile?.email || user?.email || ''}
                  disabled
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Verification Status
                  </label>
                  <div className="px-4 py-2 bg-[#222831] border border-[#4b5563] rounded-lg">
                    <span className={`text-sm ${profile?.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {profile?.emailVerified ? '✓ Verified' : '⚠ Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="px-3 py-2 bg-[#222831] border border-[#4b5563] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                    >
                      {COUNTRY_CODES.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.flag} {cc.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="flex-1 px-4 py-2 bg-[#222831] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 bg-[#222831] border border-[#4b5563] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                />
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="State/Province"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State or Province"
                />
                <Input
                  label="Zip/Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Zip or Postal Code"
                />
              </div>


              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  {saving ? 'Updating...' : 'Update Profile'}
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

