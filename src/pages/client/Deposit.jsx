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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Make Deposit</h1>
        <p className="text-sm text-[var(--text-tertiary)]">
          Add funds to your account by submitting a deposit request.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] shadow-sm p-6 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Enter deposit amount"
            min="0.01"
            step="0.01"
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#00ADB5] transition-colors duration-200"
            >
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Crypto</option>
              <option>PayPal</option>
            </select>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Submitting...' : 'Submit Deposit'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Deposit;
