import { useState, useEffect } from 'react';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';
import { pinService } from '../../../services/pinService';
import { formatDateWithRelative, formatRelativeTime } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';

const AllPins = ({ filterType = 'all', filterStatus = null }) => {
  const { user } = useAuth();
  const [pins, setPins] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    totalPins: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get title based on filter
  const getTitle = () => {
    if (filterStatus === 'used') return 'Used Pins';
    if (filterStatus === 'unused') return 'Unused Pins';
    if (filterType === 'user') return 'User Pins';
    if (filterType === 'admin') return 'Admin Pins';
    return 'All Pins';
  };

  useEffect(() => {
    loadPins();
  }, [filterType, filterStatus]);

  useEffect(() => {
    filterPins();
  }, [pins, searchQuery, filterType, filterStatus]);

  const loadPins = async () => {
    try {
      let data;
      if (filterType === 'user') {
        data = await pinService.getUserPins();
      } else if (filterType === 'admin') {
        data = await pinService.getAdminPins();
      } else if (filterStatus === 'used') {
        data = await pinService.getUsedPins();
      } else if (filterStatus === 'unused') {
        data = await pinService.getUnusedPins();
      } else {
        data = await pinService.getAllPins();
      }
      setPins(data);
    } catch (error) {
      console.error('Error loading pins:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPins = () => {
    let filtered = [...pins];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pin) =>
          pin.pin.toLowerCase().includes(query) ||
          pin.createdBy?.toLowerCase().includes(query) ||
          pin.amount?.toString().includes(query)
      );
    }

    setFilteredPins(filtered);
  };

  const handleCreatePin = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Validation
    const errors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount is required and must be greater than 0';
    }
    if (!formData.totalPins || parseInt(formData.totalPins) <= 0) {
      errors.totalPins = 'Total number of pins is required and must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const createdBy = user?.username || 'admin';
      await pinService.createMultiplePins(
        parseFloat(formData.amount),
        parseInt(formData.totalPins),
        createdBy
      );
      setIsCreateModalOpen(false);
      setFormData({ amount: '', totalPins: '' });
      setFormErrors({});
      await loadPins(); // Reload pins
    } catch (error) {
      console.error('Error creating pins:', error);
      setFormErrors({ submit: 'Failed to create pins. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{getTitle()}</h1>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search pin"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
            {/* Created Pin Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaPaperPlane className="w-4 h-4" />
              Created Pin
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                User | Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Pin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Creation Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPins.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No pins found
                </td>
              </tr>
            ) : (
              filteredPins.map((pin) => {
                const dateInfo = formatDateWithRelative(pin.createdAt);
                const statusDate = pin.status === 'used' && pin.usedAt
                  ? formatRelativeTime(pin.usedAt)
                  : pin.status === 'unused'
                    ? formatRelativeTime(pin.createdAt)
                    : '';

                return (
                  <tr key={pin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Created via {pin.createdBy || 'admin'}
                      </div>
                      <div className="text-sm text-blue-600 cursor-pointer">
                        @{pin.createdBy || 'admin'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pin.amount || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pin.pin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-fit ${pin.status === 'used'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {pin.status === 'used' ? 'Used' : 'Unused'}
                        </span>
                        {statusDate && (
                          <span className="text-xs text-gray-500 mt-1">{statusDate}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dateInfo.dateTime}</div>
                      <div className="text-sm text-gray-500">{dateInfo.relative}</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Pin Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ amount: '', totalPins: '' });
          setFormErrors({});
        }}
        title="Created Pin"
        size="md"
        variant="light"
      >
        <form onSubmit={handleCreatePin} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter Amount"
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              <div className="ml-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                USD
              </div>
            </div>
            {formErrors.amount && (
              <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>
            )}
          </div>

          {/* Total Number of Pin Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Number of Pin <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.totalPins}
              onChange={(e) => setFormData({ ...formData, totalPins: e.target.value })}
              placeholder="Enter Number"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.totalPins ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {formErrors.totalPins && (
              <p className="mt-1 text-sm text-red-500">{formErrors.totalPins}</p>
            )}
          </div>

          {formErrors.submit && (
            <div className="text-sm text-red-500">{formErrors.submit}</div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="primary"
              className="px-8 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Created'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllPins;
