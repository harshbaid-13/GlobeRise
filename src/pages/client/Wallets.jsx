import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletCard from '../../components/wallet/WalletCard';
import WalletTransferModal from '../../components/wallet/WalletTransferModal';
import { walletService } from '../../services/walletService';
import { walletLinkService } from '../../services/walletLinkService';
import { WALLET_TYPES } from '../../utils/walletConstants';
import { formatCurrency } from '../../utils/formatters';
import { FaWallet, FaExchangeAlt, FaLink, FaUnlink } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';

const Wallets = () => {
    const navigate = useNavigate();
    const [balances, setBalances] = useState({});
    const [linkedWallets, setLinkedWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const fetchBalances = async () => {
        try {
            const data = await walletService.getBalances();
            setBalances(data);
        } catch (err) {
            setError('Failed to fetch wallet balances');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLinkedWallets = async () => {
        try {
            const data = await walletLinkService.getLinkedWallets();
            setLinkedWallets(data || []);
        } catch (err) {
            console.error('Failed to fetch linked wallets:', err);
        }
    };

    useEffect(() => {
        fetchBalances();
        fetchLinkedWallets();
    }, []);

    const handleTransferClick = (walletType) => {
        setSelectedWallet(walletType);
        setTransferModalOpen(true);
    };

    const handleWithdrawClick = (walletType) => {
        navigate('/client/wallets/withdrawal');
    };

    const handleTransfer = async (from, to, amount) => {
        try {
            await walletService.transfer(from, to, amount);
            setSuccess('Transfer completed successfully!');
            await fetchBalances(); // Refresh balances
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleUnlinkWallet = async (walletId) => {
        try {
            await walletLinkService.unlinkWallet(walletId);
            setSuccess('Wallet unlinked successfully!');
            await fetchLinkedWallets();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unlink wallet');
            setTimeout(() => setError(''), 5000);
        }
    };

    const totalBalance = Object.values(balances).reduce((sum, bal) => sum + parseFloat(bal || 0), 0);

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Wallets</h1>
            </div>

            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            {/* Total Balance Card */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[var(--text-tertiary)] text-sm mb-1">Total Balance Across All Wallets</p>
                        <h2 className="text-4xl font-bold text-[var(--text-primary)]">{formatCurrency(totalBalance)}</h2>
                    </div>
                    <FaWallet className="text-5xl text-green-400 opacity-50" />
                </div>
            </div>

            {/* Wallet Cards Grid */}
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Platform Wallets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Deposit Wallet */}
                    <WalletCard
                        type={WALLET_TYPES.DEPOSIT}
                        balance={balances.deposit || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />

                    {/* ROI Wallet */}
                    <WalletCard
                        type={WALLET_TYPES.ROI}
                        balance={balances.roi || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />

                    {/* Staking Wallet */}
                    <WalletCard
                        type={WALLET_TYPES.STAKING}
                        balance={balances.staking || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />

                    {/* Rewards Wallet */}
                    <WalletCard
                        type={WALLET_TYPES.REWARD}
                        balance={balances.reward || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />

                    {/* Withdrawal Wallet */}
                    <WalletCard
                        type={WALLET_TYPES.WITHDRAWAL}
                        balance={balances.withdrawal || 0}
                        onTransfer={handleTransferClick}
                        onWithdraw={handleWithdrawClick}
                        showTransfer={true}
                        showWithdraw={true}
                    />

                    {/* Fiat Wallet */}
                    <WalletCard
                        type={WALLET_TYPES.FIAT}
                        balance={balances.fiat || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />
                </div>
            </div>

            {/* Linked Blockchain Wallets */}
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <FaLink className="text-blue-500" />
                        Linked Blockchain Wallets
                    </h2>
                    <button
                        onClick={() => navigate('/client/wallets/link')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <FaLink />
                        Link Wallet
                    </button>
                </div>

                {linkedWallets.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-tertiary)]">
                        <FaWallet className="mx-auto text-5xl mb-4 opacity-50" />
                        <p>No linked wallets yet</p>
                        <p className="text-sm mt-2">Link your MetaMask or Trust Wallet to view balances</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {linkedWallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] p-4 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            wallet.walletType === 'METAMASK' 
                                                ? 'bg-orange-500/20 text-orange-400' 
                                                : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {wallet.walletType}
                                        </span>
                                        <span className="text-[var(--text-tertiary)] text-sm">Chain ID: {wallet.chainId}</span>
                                    </div>
                                    <p className="text-[var(--text-primary)] font-mono text-sm break-all">{wallet.address}</p>
                                    {wallet.balance && (
                                        <p className="text-green-400 font-semibold mt-2">
                                            Balance: {formatCurrency(parseFloat(wallet.balance || 0))}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleUnlinkWallet(wallet.id)}
                                    className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <FaUnlink />
                                    Unlink
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Transfer Section */}
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)] p-6 transition-colors duration-200">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <FaExchangeAlt className="text-green-500" />
                    Quick Transfer
                </h2>
                <p className="text-[var(--text-tertiary)] text-sm mb-4">
                    Click on any wallet card above and use the transfer button to move funds between wallets
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {Object.keys(WALLET_TYPES).map((key) => {
                        const walletType = WALLET_TYPES[key];
                        return (
                            <button
                                key={key}
                                onClick={() => handleTransferClick(walletType)}
                                className="px-4 py-2 bg-[var(--bg-primary)] hover:bg-[#00ADB5]/20 border border-[var(--border-color)] hover:border-[#00ADB5] rounded-lg text-[var(--text-primary)] text-sm transition-colors"
                            >
                                {walletType}
                            </button>
                        );
                    })}
                </div>
            </div>

            <WalletTransferModal
                isOpen={transferModalOpen}
                onClose={() => setTransferModalOpen(false)}
                onTransfer={handleTransfer}
                sourceWallet={selectedWallet}
                balances={balances}
            />
        </div>
    );
};

export default Wallets;
