import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supportService } from '../../services/supportService';
import Alert from '../../components/common/Alert';

const ClientSupport = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await supportService.createTicket({
        userId: user?.id || '1',
        subject,
        message,
        priority: 'medium',
      });
      setSuccess('Support ticket created successfully!');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Support Ticket</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Enter ticket subject"
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
              placeholder="Enter your message"
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClientSupport;

