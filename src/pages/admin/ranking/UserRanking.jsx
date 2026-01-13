import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaEyeSlash, FaCloudUploadAlt } from 'react-icons/fa';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { rankingService } from '../../../services/rankingService';
import { formatCurrency } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const UserRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [selectedRanking, setSelectedRanking] = useState(null);
  const [formData, setFormData] = useState({
    icon: '',
    level: '',
    name: '',
    requiredBusiness: '',
    bonusAmount: '',
    royaltyPercent: '',
    levelStartValue: '',
    levelEndValue: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [iconPreview, setIconPreview] = useState('');

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const data = await rankingService.getAllRankings();
      
      // Check if we have old data structure and reset if needed
      const hasOldData = data.some(r => 
        r.bvLeft !== undefined || 
        r.bvRight !== undefined || 
        ['Silver', 'Silver Pro', 'Gold', 'Gold Pro', 'Platinum'].includes(r.name)
      );
      
      if (hasOldData || data.length < 10) {
        // Reset to new rankings
        const newData = await rankingService.resetToDefault();
        const sortedData = [...(newData || [])].sort((a, b) => {
          const orderA = a.order || a.level || 0;
          const orderB = b.order || b.level || 0;
          return orderA - orderB;
        });
        setRankings(sortedData);
      } else {
        // Sort by order or level to ensure proper display order
        const sortedData = [...(data || [])].sort((a, b) => {
          const orderA = a.order || a.level || 0;
          const orderB = b.order || b.level || 0;
          return orderA - orderB;
        });
        setRankings(sortedData);
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      icon: '',
      level: '',
      name: '',
      requiredBusiness: '',
      bonusAmount: '',
      royaltyPercent: '',
      levelStartValue: '',
      levelEndValue: '',
    });
    setFormErrors({});
    setIconPreview('');
    setSelectedRanking(null);
    setIsEditModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleEdit = (ranking) => {
    if (!ranking) {
      console.error('No ranking provided to handleEdit');
      return;
    }

    setSelectedRanking(ranking);
    setFormData({
      icon: ranking.icon || '',
      level: ranking.level?.toString() || ranking.order?.toString() || '',
      name: ranking.name || '',
      requiredBusiness: ranking.requiredBusiness?.toString() || '',
      bonusAmount: ranking.bonusAmount?.toString() || ranking.bonus?.toString() || '',
      royaltyPercent: ranking.royaltyPercent?.toString() || '',
      levelStartValue: ranking.levelStartValue?.toString() || '',
      levelEndValue: ranking.levelEndValue?.toString() || '',
    });
    setIconPreview(ranking.icon || '');
    setFormErrors({});
    setIsAddModalOpen(false);
    setIsDisableModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDisable = (ranking) => {
    setSelectedRanking(ranking);
    setIsDisableModalOpen(true);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setFormErrors({ ...formErrors, icon: 'Only PNG, JPG, and JPEG files are allowed' });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({ ...formErrors, icon: 'File size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, icon: base64String });
        setIconPreview(base64String);
        setFormErrors({ ...formErrors, icon: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.icon && !iconPreview) errors.icon = 'Icon is required';
    if (!formData.level || parseInt(formData.level) <= 0) errors.level = 'Level must be greater than 0';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.requiredBusiness || parseFloat(formData.requiredBusiness) < 0) errors.requiredBusiness = 'Required Business must be 0 or greater';
    if (!formData.bonusAmount || parseFloat(formData.bonusAmount) < 0) errors.bonusAmount = 'Bonus Amount must be 0 or greater';
    if (formData.royaltyPercent === '' || parseFloat(formData.royaltyPercent) < 0) errors.royaltyPercent = 'Royalty Percent must be 0 or greater';
    if (!formData.levelStartValue || parseFloat(formData.levelStartValue) < 0) errors.levelStartValue = 'Level Start Value must be 0 or greater';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const rankingData = {
        level: parseInt(formData.level),
        order: parseInt(formData.level),
        name: formData.name.trim(),
        requiredBusiness: parseFloat(formData.requiredBusiness),
        bonusAmount: parseFloat(formData.bonusAmount),
        royaltyPercent: parseFloat(formData.royaltyPercent) || 0,
        icon: formData.icon || iconPreview,
        levelStartValue: formData.levelStartValue ? parseFloat(formData.levelStartValue) : 0,
        levelEndValue: formData.levelEndValue ? parseFloat(formData.levelEndValue) : null,
        status: 'enabled',
      };

      if (isEditModalOpen && selectedRanking) {
        await rankingService.updateRanking(selectedRanking.id, rankingData);
      } else {
        await rankingService.createRanking(rankingData);
      }

      await loadRankings();
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      setSelectedRanking(null);
      setFormData({
        icon: '',
        level: '',
        name: '',
        requiredBusiness: '',
        bonusAmount: '',
        royaltyPercent: '',
        levelStartValue: '',
        levelEndValue: '',
      });
      setIconPreview('');
    } catch (error) {
      console.error('Error saving ranking:', error);
    }
  };

  const handleConfirmDisable = async () => {
    if (!selectedRanking) return;

    try {
      await rankingService.updateRanking(selectedRanking.id, { status: 'disabled' });
      await loadRankings();
      setIsDisableModalOpen(false);
      setSelectedRanking(null);
    } catch (error) {
      console.error('Error disabling ranking:', error);
    }
  };

  const columns = [
    {
      header: 'Icon',
      accessor: 'icon',
      render: (value, row) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img src={value} alt={`${row.name} icon`} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#008a91] flex items-center justify-center">
              <span className="text-xs font-bold text-white">{row.name?.charAt(0) || '?'}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Level',
      accessor: 'level'
    },
    {
      header: 'Name',
      accessor: 'name'
    },
    {
      header: 'Total Team Business',
      accessor: 'requiredBusiness',
      render: (value) => formatCurrency(value)
    },
    {
      header: 'One Time Bonus',
      accessor: 'bonusAmount',
      render: (value, row) => formatCurrency(value || row.bonus || 0)
    },
    {
      header: 'Royalty %',
      accessor: 'royaltyPercent',
      render: (value) => value ? `${value}%` : '0%'
    },
    {
      header: 'Level Start',
      accessor: 'levelStartValue',
      render: (value) => value ? formatCurrency(value) : '-'
    },
    {
      header: 'Level End',
      accessor: 'levelEndValue',
      render: (value) => value ? formatCurrency(value) : '-'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${value === 'enabled'
          ? 'bg-[#10b981] text-white'
          : 'bg-gray-500 text-white'
          }`}>
          {value === 'enabled' ? 'Enabled' : 'Disabled'}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-[#00ADB5] border border-[#00ADB5] rounded-lg hover:bg-[#00ADB5]/10 transition-colors"
          >
            <FaEdit className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDisable(row);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-[#ef4444] border border-[#ef4444] rounded-lg hover:bg-[#ef4444]/10 transition-colors"
          >
            <FaEyeSlash className="w-3 h-3" />
            <span>Disable</span>
          </button>
        </div>
      )
    },
  ];

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">User Rankings</h1>
        <Button
          variant="primary"
          onClick={handleAddNew}
          className="flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#00ADB5]">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No rankings available. Click "Add New" to create a ranking.
                  </td>
                </tr>
              ) : (
                rankings.map((ranking) => (
                  <tr key={ranking.id} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {column.render ? column.render(ranking[column.accessor], ranking) : (ranking[column.accessor] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Ranking Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRanking(null);
          setFormErrors({});
          setIconPreview('');
        }}
        title="Edit User Ranking"
        size="md"
        variant="light"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              {iconPreview ? (
                <div className="relative">
                  <img src={iconPreview} alt="Preview" className="w-full h-32 object-contain mx-auto" />
                  <button
                    type="button"
                    onClick={() => {
                      setIconPreview('');
                      setFormData({ ...formData, icon: '' });
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full h-32 bg-white border border-gray-200 rounded flex items-center justify-center mb-2">
                    <span className="text-gray-400 text-sm">100x100</span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FaCloudUploadAlt className="w-5 h-5" />
                    <span>Upload Icon</span>
                    <input
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={handleIconChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">Supported Files: .png, .jpg, .jpeg. Image will be resized into 100x100px</p>
            {formErrors.icon && <p className="mt-1 text-sm text-red-500">{formErrors.icon}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.level ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter level"
            />
            {formErrors.level && <p className="mt-1 text-sm text-red-500">{formErrors.level}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter ranking name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Team Business <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.requiredBusiness}
                onChange={(e) => setFormData({ ...formData, requiredBusiness: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.requiredBusiness ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter total team business"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.requiredBusiness && <p className="mt-1 text-sm text-red-500">{formErrors.requiredBusiness}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One Time Bonus <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.bonusAmount}
                onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.bonusAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter bonus amount"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.bonusAmount && <p className="mt-1 text-sm text-red-500">{formErrors.bonusAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Royalty Percent
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.royaltyPercent}
                onChange={(e) => setFormData({ ...formData, royaltyPercent: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.royaltyPercent ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter royalty percent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                %
              </span>
            </div>
            {formErrors.royaltyPercent && <p className="mt-1 text-sm text-red-500">{formErrors.royaltyPercent}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level Start Value (Business Volume)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.levelStartValue}
                onChange={(e) => setFormData({ ...formData, levelStartValue: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.levelStartValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Business volume where this level starts"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.levelStartValue && <p className="mt-1 text-sm text-red-500">{formErrors.levelStartValue}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level End Value (Business Volume) <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.levelEndValue}
                onChange={(e) => setFormData({ ...formData, levelEndValue: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.levelEndValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Business volume where this level ends (leave empty for no limit)"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.levelEndValue && <p className="mt-1 text-sm text-red-500">{formErrors.levelEndValue}</p>}
          </div>

          <div className="flex justify-center pt-4">
            <Button type="submit" variant="primary" className="px-8">
              Submit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Ranking Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormErrors({});
          setIconPreview('');
        }}
        title="Add New User Ranking"
        size="md"
        variant="light"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              {iconPreview ? (
                <div className="relative">
                  <img src={iconPreview} alt="Preview" className="w-full h-32 object-contain mx-auto" />
                  <button
                    type="button"
                    onClick={() => {
                      setIconPreview('');
                      setFormData({ ...formData, icon: '' });
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full h-32 bg-white border border-gray-200 rounded flex items-center justify-center mb-2">
                    <span className="text-gray-400 text-sm">100x100</span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <FaCloudUploadAlt className="w-5 h-5" />
                    <span>Upload Icon</span>
                    <input
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={handleIconChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">Supported Files: .png, .jpg, .jpeg. Image will be resized into 100x100px</p>
            {formErrors.icon && <p className="mt-1 text-sm text-red-500">{formErrors.icon}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.level ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter level"
            />
            {formErrors.level && <p className="mt-1 text-sm text-red-500">{formErrors.level}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter ranking name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Team Business <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.requiredBusiness}
                onChange={(e) => setFormData({ ...formData, requiredBusiness: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.requiredBusiness ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter total team business"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.requiredBusiness && <p className="mt-1 text-sm text-red-500">{formErrors.requiredBusiness}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              One Time Bonus <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.bonusAmount}
                onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.bonusAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter bonus amount"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.bonusAmount && <p className="mt-1 text-sm text-red-500">{formErrors.bonusAmount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Royalty Percent
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.royaltyPercent}
                onChange={(e) => setFormData({ ...formData, royaltyPercent: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.royaltyPercent ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter royalty percent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                %
              </span>
            </div>
            {formErrors.royaltyPercent && <p className="mt-1 text-sm text-red-500">{formErrors.royaltyPercent}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level Start Value (Business Volume)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.levelStartValue}
                onChange={(e) => setFormData({ ...formData, levelStartValue: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.levelStartValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Business volume where this level starts"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.levelStartValue && <p className="mt-1 text-sm text-red-500">{formErrors.levelStartValue}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level End Value (Business Volume) <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.levelEndValue}
                onChange={(e) => setFormData({ ...formData, levelEndValue: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.levelEndValue ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Business volume where this level ends (leave empty for no limit)"
              />
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-700">
                USD
              </span>
            </div>
            {formErrors.levelEndValue && <p className="mt-1 text-sm text-red-500">{formErrors.levelEndValue}</p>}
          </div>

          <div className="flex justify-center pt-4">
            <Button type="submit" variant="primary" className="px-8">
              Submit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Disable Confirmation Modal */}
      <Modal
        isOpen={isDisableModalOpen}
        onClose={() => {
          setIsDisableModalOpen(false);
          setSelectedRanking(null);
        }}
        title="Confirmation Alert!"
        size="sm"
        variant="light"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-center">
            Are you sure to disable this ranking?
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={() => {
                setIsDisableModalOpen(false);
                setSelectedRanking(null);
              }}
              className="px-6 py-2 bg-[#00ADB5] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium"
            >
              No
            </button>
            <button
              onClick={handleConfirmDisable}
              className="px-6 py-2 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00ADB5] transition-colors font-medium"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserRanking;
