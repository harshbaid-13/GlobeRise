import { useState } from 'react';
import { FaEnvelope, FaSms, FaBell, FaCheck, FaChevronDown } from 'react-icons/fa';
import { userService } from '../../../services/userService';
import Alert from '../../../components/common/Alert';
import RichTextEditor from '../../../components/common/RichTextEditor';

const SendNotification = () => {
  const [notificationMethod, setNotificationMethod] = useState('email');
  const [recipient, setRecipient] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [startForm, setStartForm] = useState('');
  const [perBatch, setPerBatch] = useState('');
  const [coolingPeriod, setCoolingPeriod] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare notification data
      const notificationData = {
        method: notificationMethod,
        recipient,
        subject,
        message,
        startForm: parseInt(startForm) || 1,
        perBatch: parseInt(perBatch) || 1,
        coolingPeriod: parseInt(coolingPeriod) || 0,
      };

      // In a real app, this would use the userService with the new data structure
      await userService.sendNotification([], message);
      setSuccess('Notification sent successfully!');
      
      // Reset form
      setSubject('');
      setMessage('');
      setStartForm('');
      setPerBatch('');
      setCoolingPeriod('');
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Notification to Verified Users</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Notification Method Selection */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setNotificationMethod('email')}
            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
              notificationMethod === 'email'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            style={{ width: '200px', height: '120px' }}
          >
            {notificationMethod === 'email' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
            )}
            <FaEnvelope className={`text-3xl mb-2 ${notificationMethod === 'email' ? 'text-purple-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${notificationMethod === 'email' ? 'text-purple-600' : 'text-gray-700'}`}>
              Send Via Email
            </span>
          </button>

          <button
            type="button"
            onClick={() => setNotificationMethod('sms')}
            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
              notificationMethod === 'sms'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            style={{ width: '200px', height: '120px' }}
          >
            {notificationMethod === 'sms' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
            )}
            <FaSms className={`text-3xl mb-2 ${notificationMethod === 'sms' ? 'text-purple-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${notificationMethod === 'sms' ? 'text-purple-600' : 'text-gray-700'}`}>
              Send Via SMS
            </span>
          </button>

          <button
            type="button"
            onClick={() => setNotificationMethod('firebase')}
            className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${
              notificationMethod === 'firebase'
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            style={{ width: '200px', height: '120px' }}
          >
            {notificationMethod === 'firebase' && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
            )}
            <FaBell className={`text-3xl mb-2 ${notificationMethod === 'firebase' ? 'text-purple-600' : 'text-gray-400'}`} />
            <span className={`font-medium ${notificationMethod === 'firebase' ? 'text-purple-600' : 'text-gray-700'}`}>
              Send Via Firebase
            </span>
          </button>
        </div>

        {/* Recipient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Being Sent To <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none bg-white text-gray-900"
              required
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Users</option>
              <option value="unverified">Unverified Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject / Title"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        {/* Message Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={message}
            onChange={setMessage}
            placeholder="Enter your message..."
          />
        </div>

        {/* Batch and Timing Settings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Form <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={startForm}
              onChange={(e) => setStartForm(e.target.value)}
              placeholder="Start form user id. e.g. 1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Per Batch <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={perBatch}
                onChange={(e) => setPerBatch(e.target.value)}
                placeholder="How many user"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
                min="1"
              />
              <button
                type="button"
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                User
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooling Period <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={coolingPeriod}
                onChange={(e) => setCoolingPeriod(e.target.value)}
                placeholder="Waiting time"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
                min="0"
              />
              <button
                type="button"
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Seconds
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotification;
