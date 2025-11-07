import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const EPinRecharge = () => {
  const [pin, setPin] = useState('');
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

      if (!pin || pin.length < 8) {
        throw new Error('Please enter a valid E-pin');
      }

      setSuccess('E-pin recharged successfully!');
      setPin('');
    } catch (err) {
      setError(err.message || 'Failed to recharge E-pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">E-pin Recharge</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Enter your E-pin code to recharge your account balance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <Input
            label="E-pin Code"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            placeholder="Enter E-pin code"
            maxLength={20}
          />

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Processing...' : 'Recharge'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EPinRecharge;

