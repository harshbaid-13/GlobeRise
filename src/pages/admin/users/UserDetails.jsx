import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaWallet, 
  FaBuilding, 
  FaExchangeAlt, 
  FaPlus, 
  FaMinus, 
  FaList, 
  FaBell, 
  FaSitemap, 
  FaBan
} from 'react-icons/fa';
import { userService } from '../../../services/userService';
import { formatCurrency } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';
import Button from '../../../components/common/Button';

const countries = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Colombia', code: 'CO' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'India', code: 'IN' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Brazil', code: 'BR' },
];

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileCountryCode: '+1',
    mobile: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '[Email is Protected for the demo]',
        mobileCountryCode: user.mobileCountryCode || '+1',
        mobile: user.mobile ? user.mobile.replace(user.mobileCountryCode || '+1', '') : '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: user.country || 'United States',
      });
    }
  }, [user]);

  const loadUser = async () => {
    try {
      const data = await userService.getUserById(id);
      setUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await userService.updateUser(id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        mobile: formData.mobileCountryCode + formData.mobile,
        mobileCountryCode: formData.mobileCountryCode,
      });
      // Reload user data
      await loadUser();
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading size="lg" />;
  if (!user) return <div className="p-6 text-white">User not found</div>;

  const metricCards = [
    {
      title: 'Balance',
      value: formatCurrency(user.balance || 0),
      icon: FaWallet,
      color: 'bg-blue-600',
    },
    {
      title: 'Deposits',
      value: formatCurrency(user.totalDeposited || 0),
      icon: FaWallet,
      color: 'bg-teal-600',
    },
    {
      title: 'Withdrawals',
      value: formatCurrency(user.totalWithdrawn || 0),
      icon: FaBuilding,
      color: 'bg-orange-600',
    },
    {
      title: 'Transactions',
      value: (user.transactions || 0).toString(),
      icon: FaExchangeAlt,
      color: 'bg-red-600',
    },
    {
      title: 'Total Invest',
      value: formatCurrency(user.totalInvest || 0),
      icon: FaWallet,
      color: 'bg-blue-600',
    },
    {
      title: 'Total Referral Commission',
      value: formatCurrency(user.totalReferralCommission || 0),
      icon: FaWallet,
      color: 'bg-blue-600',
    },
    {
      title: 'Total Binary Commission',
      value: formatCurrency(user.totalBinaryCommission || 0),
      icon: FaWallet,
      color: 'bg-blue-600',
    },
    {
      title: 'Total BV',
      value: (user.totalBV || 0).toLocaleString(),
      icon: FaExchangeAlt,
      color: 'bg-green-600',
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              User Detail - {user.username}
            </h1>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {metricCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`${card.color} rounded-lg shadow-md p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                  <Icon className="text-3xl opacity-75" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <Button
              variant="success"
              className="flex items-center space-x-2"
            >
              <FaPlus />
              <span>Balance</span>
            </Button>
            <Button
              variant="danger"
              className="flex items-center space-x-2"
            >
              <FaMinus />
              <span>Balance</span>
            </Button>
            <Button
              className="bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2"
            >
              <FaList />
              <span>Logins</span>
            </Button>
            <Button
              className="bg-gray-600 text-white hover:bg-gray-700 flex items-center space-x-2"
            >
              <FaBell />
              <span>Notifications</span>
            </Button>
            <Button
              variant="success"
              className="flex items-center space-x-2"
            >
              <FaSitemap />
              <span>User Tree</span>
            </Button>
            <Button
              variant="warning"
              className="flex items-center space-x-2"
            >
              <FaBan />
              <span>Ban User</span>
            </Button>
          </div>
        </div>

        {/* User Information Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Information of {user.firstName} {user.lastName}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.userType === 'free' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
              {user.userType === 'free' ? 'Free User' : 'Paid User'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.mobileCountryCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobileCountryCode: e.target.value }))}
                    className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-lg text-gray-700 w-20"
                    readOnly
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip/Postal
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  required
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Verification Status */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Verification
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
                      user.emailVerified ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </button>
                  <div className={`absolute top-0 right-0 w-1 h-full ${
                    user.emailVerified ? 'bg-blue-700' : 'bg-blue-700'
                  } rounded-r-lg`}></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Verification
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
                      user.mobileVerified ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {user.mobileVerified ? 'Verified' : 'Unverified'}
                  </button>
                  <div className={`absolute top-0 right-0 w-1 h-full ${
                    user.mobileVerified ? 'bg-blue-700' : 'bg-blue-700'
                  } rounded-r-lg`}></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2FA Verification
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
                      user.twoFactorEnabled ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {user.twoFactorEnabled ? 'Enable' : 'Disable'}
                  </button>
                  <div className={`absolute top-0 ${user.twoFactorEnabled ? 'right-0' : 'left-0'} w-1 h-full bg-blue-700 ${
                    user.twoFactorEnabled ? 'rounded-r-lg' : 'rounded-l-lg'
                  }`}></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KYC
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
                      user.kycStatus === 'verified' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {user.kycStatus === 'verified' ? 'Verified' : user.kycStatus === 'pending' ? 'Pending' : 'Unverified'}
                  </button>
                  <div className={`absolute top-0 right-0 w-1 h-full ${
                    user.kycStatus === 'verified' ? 'bg-blue-700' : 'bg-blue-700'
                  } rounded-r-lg`}></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

