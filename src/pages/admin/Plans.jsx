import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaEyeSlash, FaQuestionCircle } from 'react-icons/fa';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { planService } from '../../services/planService';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../../components/common/Loading';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    businessVolume: '',
    referralCommission: '',
    treeCommission: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await planService.getAllPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      price: '',
      businessVolume: '',
      referralCommission: '',
      treeCommission: '',
    });
    setFormErrors({});
    setSelectedPlan(null);
    setIsEditModalOpen(false); // Ensure edit modal is closed
    setIsAddModalOpen(true);
  };

  const handleEdit = (plan) => {
    if (!plan) {
      console.error('No plan provided to handleEdit');
      return;
    }

    console.log('Opening edit modal for plan:', plan);
    setSelectedPlan(plan);
    setFormData({
      name: plan.name || '',
      price: plan.price?.toString() || '',
      businessVolume: plan.businessVolume?.toString() || '',
      referralCommission: plan.referralCommission?.toString() || '',
      treeCommission: plan.treeCommission?.toString() || '',
    });
    setFormErrors({});
    setIsAddModalOpen(false); // Ensure add modal is closed
    setIsDisableModalOpen(false); // Ensure disable modal is closed
    setIsEditModalOpen(true);
  };

  const handleDisable = (plan) => {
    setSelectedPlan(plan);
    setIsDisableModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Price must be greater than 0';
    if (!formData.businessVolume || parseFloat(formData.businessVolume) <= 0) errors.businessVolume = 'Business Volume must be greater than 0';
    if (!formData.referralCommission || parseFloat(formData.referralCommission) < 0) errors.referralCommission = 'Referral Commission must be 0 or greater';
    if (!formData.treeCommission || parseFloat(formData.treeCommission) < 0) errors.treeCommission = 'Tree Commission must be 0 or greater';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const planData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        businessVolume: parseFloat(formData.businessVolume),
        referralCommission: parseFloat(formData.referralCommission),
        treeCommission: parseFloat(formData.treeCommission),
      };

      if (isEditModalOpen && selectedPlan) {
        await planService.updatePlan(selectedPlan.id, planData);
      } else {
        await planService.createPlan(planData);
      }

      await loadPlans();
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      setSelectedPlan(null);
      setFormData({
        name: '',
        price: '',
        businessVolume: '',
        referralCommission: '',
        treeCommission: '',
      });
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleConfirmDisable = async () => {
    if (!selectedPlan) return;

    try {
      await planService.updatePlan(selectedPlan.id, { status: 'disabled' });
      await loadPlans();
      setIsDisableModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error disabling plan:', error);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name'
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (value) => formatCurrency(value)
    },
    {
      header: 'Business Volume (BV)',
      accessor: 'businessVolume'
    },
    {
      header: 'Referral Commission',
      accessor: 'referralCommission',
      render: (value) => formatCurrency(value)
    },
    {
      header: 'Tree Commission',
      accessor: 'treeCommission',
      render: (value) => formatCurrency(value)
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
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-[#00d4ff] border border-[#00d4ff] rounded-lg hover:bg-[#00d4ff]/10 transition-colors"
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
        <h1 className="text-2xl font-bold text-black">Plans</h1>
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
            <thead className="bg-[#3b82f6]">
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
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No plans available
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {column.render ? column.render(plan[column.accessor], plan) : plan[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlan(null);
          setFormErrors({});
        }}
        title="Edit Plan"
        size="md"
        variant="light"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter plan name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-700">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.price ? 'border-red-500' : ''
                  }`}
                placeholder="0.00"
              />
            </div>
            {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Volume (BV) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="1"
                min="0"
                value={formData.businessVolume}
                onChange={(e) => setFormData({ ...formData, businessVolume: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.businessVolume ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter business volume"
              />
              <FaQuestionCircle className="ml-2 text-gray-400 cursor-help" title="Business Volume" />
            </div>
            {formErrors.businessVolume && <p className="mt-1 text-sm text-red-500">{formErrors.businessVolume}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral Commission <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-700">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.referralCommission}
                onChange={(e) => setFormData({ ...formData, referralCommission: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.referralCommission ? 'border-red-500' : ''
                  }`}
                placeholder="0.00"
              />
              <FaQuestionCircle className="ml-2 text-gray-400 cursor-help" title="Referral Commission" />
            </div>
            {formErrors.referralCommission && <p className="mt-1 text-sm text-red-500">{formErrors.referralCommission}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tree Commission <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-700">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.treeCommission}
                onChange={(e) => setFormData({ ...formData, treeCommission: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.treeCommission ? 'border-red-500' : ''
                  }`}
                placeholder="0.00"
              />
              <FaQuestionCircle className="ml-2 text-gray-400 cursor-help" title="Tree Commission" />
            </div>
            {formErrors.treeCommission && <p className="mt-1 text-sm text-red-500">{formErrors.treeCommission}</p>}
          </div>

          <div className="flex justify-center pt-4">
            <Button type="submit" variant="primary" className="px-8">
              Submit
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormErrors({});
        }}
        title="Add Plan"
        size="md"
        variant="light"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter plan name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-700">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.price ? 'border-red-500' : ''
                  }`}
                placeholder="0.00"
              />
            </div>
            {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Volume (BV) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="1"
                min="0"
                value={formData.businessVolume}
                onChange={(e) => setFormData({ ...formData, businessVolume: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.businessVolume ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter business volume"
              />
              <FaQuestionCircle className="ml-2 text-gray-400 cursor-help" title="Business Volume" />
            </div>
            {formErrors.businessVolume && <p className="mt-1 text-sm text-red-500">{formErrors.businessVolume}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral Commission <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-700">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.referralCommission}
                onChange={(e) => setFormData({ ...formData, referralCommission: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.referralCommission ? 'border-red-500' : ''
                  }`}
                placeholder="0.00"
              />
              <FaQuestionCircle className="ml-2 text-gray-400 cursor-help" title="Referral Commission" />
            </div>
            {formErrors.referralCommission && <p className="mt-1 text-sm text-red-500">{formErrors.referralCommission}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tree Commission <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg text-gray-700">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.treeCommission}
                onChange={(e) => setFormData({ ...formData, treeCommission: e.target.value })}
                className={`flex-1 px-3 py-2 bg-white border border-gray-300 border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${formErrors.treeCommission ? 'border-red-500' : ''
                  }`}
                placeholder="0.00"
              />
              <FaQuestionCircle className="ml-2 text-gray-400 cursor-help" title="Tree Commission" />
            </div>
            {formErrors.treeCommission && <p className="mt-1 text-sm text-red-500">{formErrors.treeCommission}</p>}
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
          setSelectedPlan(null);
        }}
        title="Confirmation Alert!"
        size="sm"
        variant="light"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-center">
            Are you sure to disable this plan?
          </p>
          <div className="flex justify-center space-x-4 pt-4">
            <button
              onClick={() => {
                setIsDisableModalOpen(false);
                setSelectedPlan(null);
              }}
              className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium"
            >
              No
            </button>
            <button
              onClick={handleConfirmDisable}
              className="px-6 py-2 bg-[#00d4ff] text-white rounded-lg hover:bg-[#3b82f6] transition-colors font-medium"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Plans;
