import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { WALLET_LABELS, WALLET_TYPES } from '../../utils/walletConstants';

const WalletTransferModal = ({ isOpen, onClose, onTransfer, sourceWallet, balances }) => {
    const [amount, setAmount] = useState('');
    const [targetWallet, setTargetWallet] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setError('');
            setTargetWallet('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!targetWallet) {
            setError('Please select a target wallet');
            return;
        }

        if (parseFloat(amount) > parseFloat(balances[sourceWallet] || 0)) {
            setError('Insufficient balance');
            return;
        }

        setLoading(true);
        try {
            await onTransfer(sourceWallet, targetWallet, parseFloat(amount));
            onClose();
        } catch (err) {
            setError(err.message || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    // Determine allowed target wallets based on source
    const getAllowedTargets = () => {
        if (sourceWallet === WALLET_TYPES.REWARD) {
            return [WALLET_TYPES.DEPOSIT, WALLET_TYPES.WITHDRAWAL];
        }
        if (sourceWallet === WALLET_TYPES.FIAT) {
            return [WALLET_TYPES.DEPOSIT, WALLET_TYPES.STAKING];
        }
        return [];
    };

    const allowedTargets = getAllowedTargets();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Transfer from ${WALLET_LABELS[sourceWallet]}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Target Wallet</label>
                    <select
                        value={targetWallet}
                        onChange={(e) => setTargetWallet(e.target.value)}
                        className="w-full px-3 py-2 bg-[#252a3a] border border-[#374151] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white"
                        required
                    >
                        <option value="">Select Wallet</option>
                        {allowedTargets.map(type => (
                            <option key={type} value={type}>
                                {WALLET_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    error={error}
                />

                <div className="text-sm text-gray-400">
                    Available Balance: ${parseFloat(balances?.[sourceWallet] || 0).toFixed(2)}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Transferring...' : 'Transfer'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default WalletTransferModal;
