import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { withdrawalService } from '../../services/withdrawalService';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../utils/formatters';

const Withdraw = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [accountDetails, setAccountDetails] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await withdrawalService.createWithdrawal({
        userId: user?.id || '1',
        amount: parseFloat(amount),
        method,
        accountDetails,
      });
      setSuccess('Withdrawal request submitted successfully!');
      setAmount('');
      setAccountDetails('');
    } catch (err) {
      setError(err.message || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Make Withdrawal</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(user?.balance || 0)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Enter withdrawal amount"
            min="0.01"
            step="0.01"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdrawal Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Bank Transfer</option>
              <option>Crypto</option>
              <option>PayPal</option>
            </select>
          </div>
          
          <Input
            label="Account Details"
            value={accountDetails}
            onChange={(e) => setAccountDetails(e.target.value)}
            required
            placeholder="Enter account details"
          />
          
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Submitting...' : 'Submit Withdrawal'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;

