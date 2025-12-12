import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { twoFactorService } from '../../services/twoFactorService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { FaShieldAlt, FaCopy, FaCheckCircle, FaLock, FaKey } from 'react-icons/fa';

const TwoFactorAuth = () => {
  const { user, refreshUser } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showDisableForm, setShowDisableForm] = useState(false);

  useEffect(() => {
    // Check user's 2FA status
    if (user?.two_factor_enabled) {
      setEnabled(true);
    }
  }, [user]);

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await twoFactorService.setup();
      setSetupData(data);
      setSuccess('2FA setup initiated. Please scan the QR code with your authenticator app.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!verificationCode || verificationCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      await twoFactorService.enable(verificationCode);
      setEnabled(true);
      setSetupData(null);
      setVerificationCode('');
      setSuccess('2FA has been enabled successfully! Your account is now more secure.');

      // Refresh user data to update 2FA status
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!password || !verificationCode) {
        throw new Error('Please enter both password and verification code');
      }

      await twoFactorService.disable(password, verificationCode);
      setEnabled(false);
      setPassword('');
      setVerificationCode('');
      setShowDisableForm(false);
      setSuccess('2FA has been disabled successfully.');

      // Refresh user data to update 2FA status
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable 2FA. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await twoFactorService.regenerateBackupCodes();
      setSetupData({ ...setupData, backupCodes: data.backupCodes });
      setSuccess('New backup codes generated successfully. Please save them securely.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to regenerate backup codes.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <FaShieldAlt className="text-blue-500" />
          Two-Factor Authentication
        </h1>
      </div>

      {/* Status Card */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6 transition-colors duration-200">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Current Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${enabled ? 'bg-green-500/20' : 'bg-[var(--bg-secondary)]'}`}>
                <FaLock className={`text-xl ${enabled ? 'text-green-500' : 'text-[var(--text-muted)]'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">2FA Status</h3>
                <p className="text-sm text-[var(--text-tertiary)]">
                  {enabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-green-500' : 'bg-[var(--text-muted)]'}`} />
              <span className={`text-sm font-medium ${enabled ? 'text-green-500' : 'text-[var(--text-tertiary)]'}`}>
                {enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Two-factor authentication adds an extra layer of security to your account by requiring both your password
              and an authentication code from your mobile device to sign in.
            </p>
          </div>
        </div>

        {/* Enable 2FA Flow */}
        {!enabled && !setupData && (
          <div>
            <p className="text-[var(--text-secondary)] mb-4">
              Enable two-factor authentication to secure your account with an additional verification step.
            </p>
            <Button onClick={handleSetup} disabled={loading}>
              {loading ? <><Loading size="sm" /> Setting up...</> : 'Enable 2FA'}
            </Button>
          </div>
        )}

        {/* Setup Flow - QR Code & Secret */}
        {!enabled && setupData && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <FaKey className="text-blue-500" />
                Step 1: Scan QR Code
              </h3>
              <p className="text-sm text-[var(--text-tertiary)] mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
              </p>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img src={setupData.qrCode} alt="2FA QR Code" className="w-64 h-64" />
              </div>

              {/* Manual Entry Option */}
              <div className="bg-[var(--bg-primary)] rounded-lg p-4 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-tertiary)] mb-2">Or enter this secret key manually:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-[var(--bg-secondary)] px-3 py-2 rounded text-green-400 font-mono text-sm border border-[var(--border-color)]">
                    {setupData.secret}
                  </code>
                  <button
                    onClick={() => copyToClipboard(setupData.secret, 'secret')}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    {copiedCode === 'secret' ? <FaCheckCircle className="text-white" /> : <FaCopy className="text-white" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Backup Codes */}
            {setupData.backupCodes && setupData.backupCodes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Backup Codes</h3>
                <p className="text-sm text-[var(--text-tertiary)] mb-4">
                  Save these backup codes in a secure location. You can use them to access your account if you lose access to your authenticator app.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
                  {setupData.backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <code className="flex-1 bg-[var(--bg-secondary)] px-3 py-2 rounded text-yellow-400 font-mono text-sm border border-[var(--border-color)]">
                        {code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(code, index)}
                        className="p-2 hover:bg-[var(--bg-secondary)] rounded transition-colors"
                      >
                        {copiedCode === index ? <FaCheckCircle className="text-green-500" /> : <FaCopy className="text-[var(--text-tertiary)]" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleEnable} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Step 2: Verify Code</h3>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Enter the 6-digit code from your authenticator app
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full md:w-64 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-widest text-center transition-colors duration-200"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" disabled={loading || verificationCode.length !== 6}>
                {loading ? <><Loading size="sm" /> Verifying...</> : 'Verify & Enable 2FA'}
              </Button>
            </form>
          </div>
        )}

        {/* Disable 2FA Flow */}
        {enabled && (
          <div>
            {!showDisableForm ? (
              <div className="space-y-4">
                <p className="text-[var(--text-secondary)]">
                  Two-factor authentication is currently protecting your account.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDisableForm(true)}>
                    Disable 2FA
                  </Button>
                  <Button variant="secondary" onClick={handleRegenerateBackupCodes} disabled={loading}>
                    {loading ? <><Loading size="sm" /> Regenerating...</> : 'Regenerate Backup Codes'}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDisable} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Enter 2FA code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full md:w-64 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-widest text-center transition-colors duration-200"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="danger" disabled={loading}>
                    {loading ? <><Loading size="sm" /> Disabling...</> : 'Disable 2FA'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowDisableForm(false);
                    setPassword('');
                    setVerificationCode('');
                    setError('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
