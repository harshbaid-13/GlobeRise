import { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { userService } from '../../../services/userService';
import Alert from '../../../components/common/Alert';

const SendNotification = () => {
  const [message, setMessage] = useState('');
  const [userIds, setUserIds] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const ids = userIds.split(',').map(id => id.trim()).filter(Boolean);
      await userService.sendNotification(ids, message);
      setSuccess('Notification sent successfully!');
      setMessage('');
      setUserIds('');
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Send Notification</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          
          <Input
            label="User IDs (comma-separated)"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            placeholder="1, 2, 3"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Notification'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SendNotification;

