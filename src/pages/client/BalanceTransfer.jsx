import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../utils/formatters';

const BalanceTransfer = () => {
  const { user } = useAuth();
  const [recipientUsername, setRecipientUsername] = useState('');
  const [amount, setAmount] = useState('');
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
      
      if (!recipientUsername || !amount) {
        throw new Error('Please fill in all fields');
      }

      if (parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (parseFloat(amount) > (user?.balance || 0)) {
        throw new Error('Insufficient balance');
      }

      setSuccess('Balance transferred successfully!');
      setRecipientUsername('');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Failed to transfer balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Balance Transfer</h1>
      
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
            label="Recipient Username"
            value={recipientUsername}
            onChange={(e) => setRecipientUsername(e.target.value)}
            required
            placeholder="Enter username"
          />

          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
          />

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Transferring...' : 'Transfer Balance'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BalanceTransfer;

