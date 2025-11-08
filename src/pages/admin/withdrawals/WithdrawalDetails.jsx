import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { withdrawalService } from '../../../services/withdrawalService';
import { formatCurrency, formatDateWithRelative } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const WithdrawalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWithdrawal();
  }, [id]);

  const loadWithdrawal = async () => {
    try {
      const data = await withdrawalService.getWithdrawalById(id);
      setWithdrawal(data);
    } catch (error) {
      console.error('Error loading withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this withdrawal?')) {
      return;
    }
    
    setProcessing(true);
    try {
      await withdrawalService.approveWithdrawal(id);
      navigate('/admin/withdrawals/pending');
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Failed to approve withdrawal. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) {
      return;
    }
    
    if (!window.confirm('Are you sure you want to reject this withdrawal?')) {
      return;
    }
    
    setProcessing(true);
    try {
      await withdrawalService.rejectWithdrawal(id, reason);
      navigate('/admin/withdrawals/pending');
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('Failed to reject withdrawal. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading size="lg" />;
  if (!withdrawal) return <div className="p-6">Withdrawal not found</div>;

  const dateInfo = formatDateWithRelative(withdrawal.createdAt);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          {withdrawal.username} requested {formatCurrency(withdrawal.amount)}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Panel: Withdrawal Via Method */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Withdrawal Via {withdrawal.gateway || withdrawal.method}
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900 font-medium">{dateInfo.dateTime}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Transaction Number</span>
                <span className="text-sm text-gray-900 font-medium">{withdrawal.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Username</span>
                <span 
                  className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
                  onClick={() => navigate(`/admin/users/details/${withdrawal.userId}`)}
                >
                  @{withdrawal.username}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm text-gray-900 font-medium">{withdrawal.gateway || withdrawal.method}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm text-gray-900 font-medium">{formatCurrency(withdrawal.amount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Charge</span>
                <span className="text-sm text-gray-900 font-medium">{formatCurrency(withdrawal.charge || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">After Charge</span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatCurrency(withdrawal.afterCharge || withdrawal.amount - (withdrawal.charge || 0))}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Rate</span>
                <span className="text-sm text-gray-900 font-medium">
                  1 {withdrawal.conversionCurrency || 'USD'} = {(withdrawal.conversionRate || 1.00).toFixed(2)} {withdrawal.conversionCurrency || 'USD'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">After Rate Conversion</span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatCurrency(withdrawal.afterConversion || withdrawal.afterCharge || withdrawal.amount - (withdrawal.charge || 0))} {withdrawal.conversionCurrency || 'USD'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
                  withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                  withdrawal.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {withdrawal.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: User Withdrawal Information */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              User Withdrawal Information
            </h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Account Number</span>
                <span className="text-sm text-gray-900 font-medium">{withdrawal.accountNumber || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Account Name</span>
                <span className="text-sm text-gray-900 font-medium">{withdrawal.accountName || withdrawal.accountDetails || 'N/A'}</span>
              </div>
              
              {withdrawal.reason && (
                <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Reason</span>
                  <span className="text-sm text-gray-900 font-medium">{withdrawal.reason}</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            {withdrawal.status === 'pending' && (
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex items-center justify-center px-4 py-2 text-sm bg-green-600 text-white font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCheck className="mr-2" />
                  Approve
                </button>
                
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="flex items-center justify-center px-4 py-2 text-sm bg-red-600 text-white font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetails;

