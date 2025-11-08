import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { depositService } from '../../../services/depositService';
import { formatCurrency, formatDateWithRelative } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const DepositDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadDeposit();
  }, [id]);

  const loadDeposit = async () => {
    try {
      const data = await depositService.getDepositById(id);
      setDeposit(data);
    } catch (error) {
      console.error('Error loading deposit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this deposit?')) {
      return;
    }
    
    setProcessing(true);
    try {
      await depositService.approveDeposit(id);
      navigate('/admin/deposits/pending');
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Failed to approve deposit. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this deposit?')) {
      return;
    }
    
    setProcessing(true);
    try {
      await depositService.rejectDeposit(id);
      navigate('/admin/deposits/pending');
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      alert('Failed to reject deposit. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading size="lg" />;
  if (!deposit) return <div className="p-6">Deposit not found</div>;

  const dateInfo = formatDateWithRelative(deposit.createdAt);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          {deposit.username} requested {formatCurrency(deposit.amount)}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Panel: Deposit Via Bank Transfer */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Deposit Via {deposit.gateway || deposit.method}
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900 font-medium">{dateInfo.dateTime}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Transaction Number</span>
                <span className="text-sm text-gray-900 font-medium">{deposit.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Username</span>
                <span 
                  className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
                  onClick={() => navigate(`/admin/users/details/${deposit.userId}`)}
                >
                  @{deposit.username}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Method</span>
                <span className="text-sm text-gray-900 font-medium">{deposit.gateway || deposit.method}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm text-gray-900 font-medium">{formatCurrency(deposit.amount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Charge</span>
                <span className="text-sm text-gray-900 font-medium">{formatCurrency(deposit.charge || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">After Charge</span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatCurrency(deposit.afterCharge || deposit.amount + (deposit.charge || 0))}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Rate</span>
                <span className="text-sm text-gray-900 font-medium">
                  1 {deposit.conversionCurrency || 'USD'} = {(deposit.conversionRate || 1.00).toFixed(2)} {deposit.conversionCurrency || 'USD'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">After Rate Conversion</span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatCurrency(deposit.afterConversion || deposit.afterCharge || deposit.amount + (deposit.charge || 0))} {deposit.conversionCurrency || 'USD'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-1.5">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-orange-100 text-orange-800">
                  {deposit.status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: User Deposit Information */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              User Deposit Information
            </h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Account Number</span>
                <span className="text-sm text-gray-900 font-medium">{deposit.accountNumber || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                <span className="text-sm text-gray-600">Account Name</span>
                <span className="text-sm text-gray-900 font-medium">{deposit.accountName || 'N/A'}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            {deposit.status === 'pending' && (
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

export default DepositDetails;

