import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { depositService } from '../../services/depositService';
import Alert from '../../components/common/Alert';

const Deposit = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await depositService.createDeposit({
        userId: user?.id || '1',
        amount: parseFloat(amount),
        method,
      });
      setSuccess('Deposit request submitted successfully!');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Make Deposit</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Crypto</option>
              <option>PayPal</option>
            </select>
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Deposit'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Deposit;

