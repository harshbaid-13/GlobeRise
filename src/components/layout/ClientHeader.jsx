import { useState } from "react";
import {
  FaUser,
  FaWallet,
  FaHome,
  FaUsers,
  FaSitemap,
  FaPiggyBank,
  FaExchangeAlt,
  FaCreditCard,
  FaList,
  FaTrophy,
  FaTicketAlt,
  FaShieldAlt,
  FaKey,
  FaCrown,
  FaGift,
  FaHistory,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../contexts/WalletContext";
import { formatWalletAddress } from "../../utils/formatters";
import WalletConnectModal from "../wallet/WalletConnectModal";

const ClientHeader = () => {
  const { user: _user } = useAuth();
  const { address, isConnected, isCorrectNetwork, networkName } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleWalletClick = () => {
    setIsModalOpen(true);
  };

  const getPageMeta = () => {
    const fullPath = location.pathname || "";
    // Strip the /client prefix to get the sub-path
    const path = fullPath.startsWith("/client")
      ? fullPath.slice("/client".length) || "/dashboard"
      : fullPath || "/dashboard";

    // Normalize by removing trailing slashes
    const normalized = path.replace(/\/+$/, "") || "/dashboard";

    // Special handling for grouped paths
    if (normalized.startsWith("/wallets")) {
      return { title: "Wallets", Icon: FaWallet };
    }
    if (normalized.startsWith("/history")) {
      return { title: "History", Icon: FaHistory };
    }

    const map = {
      "/dashboard": { title: "Dashboard", Icon: FaHome },
      "/plans": { title: "Plans", Icon: FaFileAlt },
      "/bv-log": { title: "BV Log", Icon: FaList },
      "/my-referrals": { title: "My Referrals", Icon: FaUsers },
      "/my-tree": { title: "Referral Tree", Icon: FaSitemap },
      "/deposit": { title: "Deposit", Icon: FaPiggyBank },
      "/withdraw": { title: "Withdraw", Icon: FaPiggyBank },
      "/balance-transfer": { title: "Balance Transfer", Icon: FaExchangeAlt },
      "/epin-recharge": { title: "E-Pin Recharge", Icon: FaCreditCard },
      "/transactions": { title: "Transactions", Icon: FaList },
      "/ranking": { title: "Ranking", Icon: FaTrophy },
      "/support": { title: "Support", Icon: FaTicketAlt },
      "/2fa": { title: "Two-Factor Authentication", Icon: FaShieldAlt },
      "/profile": { title: "Profile", Icon: FaUser },
      "/change-password": { title: "Change Password", Icon: FaKey },
      "/wallets": { title: "Wallets", Icon: FaWallet },
      "/wallets/fiat": { title: "Fiat Wallet", Icon: FaWallet },
      "/wallets/deposit": { title: "Deposit Wallet", Icon: FaWallet },
      "/wallets/roi": { title: "ROI Wallet", Icon: FaWallet },
      "/wallets/staking": { title: "Staking Wallet", Icon: FaWallet },
      "/wallets/rewards": { title: "Rewards Wallet", Icon: FaWallet },
      "/investments": { title: "Investments", Icon: FaChartLine },
      "/staking": { title: "Staking", Icon: FaChartLine },
      "/team-business": { title: "Team Business", Icon: FaChartLine },
      "/individual-business": {
        title: "Individual Business",
        Icon: FaChartLine,
      },
      "/royalties": { title: "Royalties", Icon: FaCrown },
      "/bonuses": { title: "Bonuses", Icon: FaGift },
      "/my-team": { title: "My Team", Icon: FaUsers },
      "/reports": { title: "Reports", Icon: FaFileAlt },
      "/history/rewards": { title: "Rewards History", Icon: FaHistory },
      "/history/staking": { title: "Staking History", Icon: FaHistory },
      "/transaction-history": { title: "Transaction History", Icon: FaList },
      "/rank-progress": { title: "Rank Progress", Icon: FaTrophy },
      "/earnings-breakdown": { title: "Earnings Breakdown", Icon: FaFileAlt },
    };

    return map[normalized] || { title: "GlobeRise", Icon: null };
  };

  return (
    <>
      <div className="bg-[#393E46] shadow-sm border-b border-[#4b5563] px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          {(() => {
            const { title, Icon } = getPageMeta();
            return (
              <div className="flex items-center space-x-2">
                {Icon && <Icon className="w-5 h-5 text-[#00ADB5]" />}
                <h1 className="text-xl font-bold text-white tracking-wide">
                  {title}
                </h1>
              </div>
            );
          })()}

          {/* User Avatar and Wallet */}
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                {/* Network Indicator */}
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                    isCorrectNetwork
                      ? "bg-green-500/20 border-green-500"
                      : "bg-red-500/20 border-red-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isCorrectNetwork ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      isCorrectNetwork ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {networkName}
                  </span>
                </div>
                <button
                  onClick={handleWalletClick}
                  className="flex items-center space-x-2 text-sm font-semibold text-[#00ADB5] px-4 py-2 rounded hover:bg-[#00ADB5]/10 transition-colors border border-[#00ADB5]"
                >
                  <FaWallet className="w-4 h-4" />
                  <span>{formatWalletAddress(address)}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleWalletClick}
                className="flex items-center space-x-2 text-sm font-semibold text-[#00ADB5] px-4 py-2 rounded hover:bg-[#00ADB5]/10 transition-colors border border-[#00ADB5]"
              >
                <FaWallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
            <div className="w-10 h-10 bg-[#00ADB5] rounded-full flex items-center justify-center">
              <FaUser className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ClientHeader;
