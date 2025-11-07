import { useState } from 'react';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { FaShieldAlt, FaQrcode } from 'react-icons/fa';

const TwoFactorAuth = () => {
  const [enabled, setEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call to generate QR code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setQrCode('data:image/png;base64,mock-qr-code'); // Mock QR code
      setSuccess('2FA setup initiated. Please scan the QR code and enter the verification code.');
    } catch (err) {
      setError(err.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!verificationCode || verificationCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEnabled(true);
      setQrCode('');
      setVerificationCode('');
      setSuccess('2FA enabled successfully!');
    } catch (err) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEnabled(false);
      setSuccess('2FA disabled successfully!');
    } catch (err) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Two-Factor Authentication (2FA)</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaShieldAlt className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">2FA Status</h3>
              <p className="text-sm text-gray-600">
                {enabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-sm font-medium text-gray-800">
              {enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {!enabled && (
          <>
            {!qrCode ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Enable two-factor authentication to add an extra layer of security to your account.
                </p>
                <Button onClick={handleEnable} disabled={loading}>
                  {loading ? 'Setting up...' : 'Enable 2FA'}
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Scan QR Code
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
                    <FaQrcode className="w-32 h-32 text-gray-400" />
                  </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Enable'}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}

        {enabled && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Two-factor authentication is currently enabled for your account.
            </p>
            <Button variant="outline" onClick={handleDisable} disabled={loading}>
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;

