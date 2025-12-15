import { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { walletLinkService } from '../../services/walletLinkService';
import { formatWalletAddress } from '../../utils/formatters';
import { FaTimes, FaWallet, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { ethers } from 'ethers';
import Alert from '../common/Alert';

const WalletLinkModal = ({ isOpen, onClose, onLinked }) => {
  const { address, isConnected, provider, connectWallet, connectTrustWallet } = useWallet();
  const [step, setStep] = useState(1); // 1: Connect, 2: Sign, 3: Success
  const [signatureMessage, setSignatureMessage] = useState(null);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletType, setWalletType] = useState('METAMASK'); // METAMASK or TRUST_WALLET

  useEffect(() => {
    if (isOpen && isConnected && step === 1) {
      generateMessage();
    }
  }, [isOpen, isConnected, step]);

  const generateMessage = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await walletLinkService.generateSignatureMessage(address);
      setSignatureMessage(data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate signature message');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (type) => {
    try {
      setLoading(true);
      setError('');
      setWalletType(type);
      
      if (type === 'METAMASK') {
        await connectWallet();
      } else if (type === 'TRUST_WALLET') {
        await connectTrustWallet();
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    try {
      setLoading(true);
      setError('');

      if (!provider || !address) {
        throw new Error('Wallet not connected');
      }

      // Sign the message
      const signer = await provider.getSigner();
      const signedMessage = await signer.signMessage(signatureMessage.message);
      setSignature(signedMessage);

      // Link wallet
      const chainId = (await provider.getNetwork()).chainId;
      await walletLinkService.linkWallet({
        address,
        provider: walletType,
        chainId: Number(chainId),
        signature: signedMessage,
        message: signatureMessage.message,
      });

      setStep(3);
      if (onLinked) {
        onLinked();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to sign or link wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSignatureMessage(null);
    setSignature('');
    setError('');
    setWalletType('METAMASK');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] rounded-lg shadow-xl max-w-md w-full mx-4 border border-[var(--border-color)] transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Link Wallet</h2>
          <button
            onClick={handleClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && <Alert type="error" message={error} className="mb-4" />}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[var(--text-secondary)] mb-4">
                Connect your wallet to link it to your account. You can link both MetaMask and Trust Wallet.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleConnect('METAMASK')}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg hover:border-[#00ADB5] transition-colors disabled:opacity-50"
                >
                  <FaWallet className="w-6 h-6 text-[#00ADB5]" />
                  <div className="flex-1 text-left">
                    <div className="text-[var(--text-primary)] font-semibold">MetaMask</div>
                    <div className="text-[var(--text-tertiary)] text-sm">Connect with MetaMask</div>
                  </div>
                </button>

                <button
                  onClick={() => handleConnect('TRUST_WALLET')}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg hover:border-[#00ADB5] transition-colors disabled:opacity-50"
                >
                  <FaWallet className="w-6 h-6 text-[#00ADB5]" />
                  <div className="flex-1 text-left">
                    <div className="text-[var(--text-primary)] font-semibold">Trust Wallet</div>
                    <div className="text-[var(--text-tertiary)] text-sm">Connect with Trust Wallet</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && signatureMessage && (
            <div className="space-y-4">
              <div className="bg-[var(--bg-primary)] rounded-lg p-4 border border-[var(--border-color)]">
                <p className="text-[var(--text-secondary)] text-sm mb-2">Sign this message to verify wallet ownership:</p>
                <div className="bg-[var(--bg-secondary)] rounded p-3 text-xs text-[var(--text-tertiary)] font-mono break-all">
                  {signatureMessage.message}
                </div>
              </div>

              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <FaExclamationTriangle className="w-4 h-4" />
                <span>This signature does not authorize any transaction</span>
              </div>

              <button
                onClick={handleSign}
                disabled={loading}
                className="w-full px-4 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00d4e0] transition-colors disabled:opacity-50 font-semibold"
              >
                {loading ? 'Signing...' : 'Sign Message'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <FaCheck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Wallet Linked Successfully!</h3>
              <p className="text-[var(--text-secondary)]">
                Your wallet <span className="font-mono text-[#00ADB5]">{formatWalletAddress(address)}</span> has been linked to your account.
              </p>
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00d4e0] transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletLinkModal;
