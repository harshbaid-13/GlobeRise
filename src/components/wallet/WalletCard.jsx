import { FaWallet, FaExchangeAlt } from 'react-icons/fa';
import StatsCard from '../common/StatsCard';
import Button from '../common/Button';
import { WALLET_LABELS, WALLET_COLORS } from '../../utils/walletConstants';

const WalletCard = ({
    type,
    balance,
    onTransfer,
    onWithdraw,
    showTransfer = true,
    showWithdraw = false
}) => {
    const label = WALLET_LABELS[type] || type;
    const colorKey = Object.keys(WALLET_COLORS).find(key => key === type) ? type : 'FIAT';

    // Map wallet types to StatsCard colors
    const colorMap = {
        FIAT: 'blue',
        DEPOSIT: 'green',
        ROI: 'purple',
        STAKING: 'orange',
        REWARD: 'red',
        WITHDRAWAL: 'blue' // Fallback or specific
    };

    return (
        <div className="relative group">
            <StatsCard
                title={label}
                value={`$${parseFloat(balance).toFixed(2)}`}
                icon={FaWallet}
                color={colorMap[colorKey] || 'blue'}
                className="h-full"
            />

            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {showTransfer && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onTransfer(type)}
                        title="Transfer Funds"
                    >
                        <FaExchangeAlt />
                    </Button>
                )}
                {showWithdraw && (
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onWithdraw(type)}
                        title="Withdraw Funds"
                    >
                        Withdraw
                    </Button>
                )}
            </div>
        </div>
    );
};

export default WalletCard;
