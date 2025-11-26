import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletCard from '../../components/wallet/WalletCard';
import WalletTransferModal from '../../components/wallet/WalletTransferModal';
import { walletService } from '../../services/walletService';
import { WALLET_TYPES } from '../../utils/walletConstants';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';

const Wallets = () => {
    const navigate = useNavigate();
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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

    useEffect(() => {
        fetchBalances();
    }, []);

    const handleTransferClick = (walletType) => {
        setSelectedWallet(walletType);
        setTransferModalOpen(true);
    };

    const handleWithdrawClick = (walletType) => {
        navigate('/client/wallets/withdrawal');
    };

    const handleTransfer = async (from, to, amount) => {
        await walletService.transfer(from, to, amount);
        await fetchBalances(); // Refresh balances
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">My Wallets</h1>
            </div>

            {error && <Alert type="error" message={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Deposit Wallet */}
                <div onClick={() => navigate('/client/wallets/deposit')}>
                    <WalletCard
                        type={WALLET_TYPES.DEPOSIT}
                        balance={balances.deposit || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={false}
                    />
                </div>

                {/* ROI Wallet */}
                <div onClick={() => navigate('/client/wallets/roi')}>
                    <WalletCard
                        type={WALLET_TYPES.ROI}
                        balance={balances.roi || 0} // Assuming backend returns 'roi' key or similar
                        onTransfer={handleTransferClick}
                        showTransfer={false}
                    />
                </div>

                {/* Staking Wallet */}
                <div onClick={() => navigate('/client/wallets/staking')}>
                    <WalletCard
                        type={WALLET_TYPES.STAKING}
                        balance={balances.staking || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={false}
                    />
                </div>

                {/* Rewards Wallet */}
                <div onClick={() => navigate('/client/wallets/rewards')}>
                    <WalletCard
                        type={WALLET_TYPES.REWARD}
                        balance={balances.reward || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />
                </div>

                {/* Withdrawal Wallet */}
                <div onClick={() => navigate('/client/wallets/withdrawal')}>
                    <WalletCard
                        type={WALLET_TYPES.WITHDRAWAL}
                        balance={balances.withdrawal || 0}
                        onTransfer={handleTransferClick}
                        onWithdraw={handleWithdrawClick}
                        showTransfer={false}
                        showWithdraw={true}
                    />
                </div>

                {/* Fiat Wallet (External Deposits) */}
                <div onClick={() => navigate('/client/wallets/deposit')}>
                    <WalletCard
                        type={WALLET_TYPES.FIAT}
                        balance={balances.fiat || 0}
                        onTransfer={handleTransferClick}
                        showTransfer={true}
                    />
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
