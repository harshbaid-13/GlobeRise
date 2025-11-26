import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaFileAlt,
  FaUsers,
  FaSitemap,
  FaWallet,
  FaPiggyBank,
  FaExchangeAlt,
  FaCreditCard,
  FaList,
  FaTrophy,
  FaTicketAlt,
  FaShieldAlt,
  FaUser,
  FaKey,
  FaSignOutAlt,
  FaChartLine,
  FaCrown,
  FaGift,
  FaHistory,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { formatCurrency } from "../../utils/formatters";
import Logo from "../common/Logo";

const ClientSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
    { icon: FaHome, label: "Dashboard", path: ROUTES.CLIENT_DASHBOARD },
    // { icon: FaBuilding, label: 'Plan', path: ROUTES.CLIENT_PLANS },
    // { icon: FaFileAlt, label: 'Bv Log', path: ROUTES.CLIENT_BV_LOG },
    { icon: FaUsers, label: "My Referrals", path: ROUTES.CLIENT_MY_REFERRALS },
    // { icon: FaSitemap, label: 'My Tree', path: ROUTES.CLIENT_MY_TREE },
    // { icon: FaWallet, label: 'Deposit', path: ROUTES.CLIENT_DEPOSIT },
    // { icon: FaPiggyBank, label: 'Withdraw', path: ROUTES.CLIENT_WITHDRAW },
    // { icon: FaExchangeAlt, label: 'Balance Transfer', path: ROUTES.CLIENT_BALANCE_TRANSFER },
    // { icon: FaCreditCard, label: 'E-pin Recharge', path: ROUTES.CLIENT_EPIN_RECHARGE },
    // { icon: FaList, label: 'Transactions', path: ROUTES.CLIENT_TRANSACTIONS },
    { icon: FaTrophy, label: "Ranking", path: ROUTES.CLIENT_RANKING },
    // { icon: FaTicketAlt, label: 'Support Ticket', path: ROUTES.CLIENT_SUPPORT },
    { icon: FaWallet, label: "Wallets", path: ROUTES.CLIENT_WALLETS },
    // { icon: FaChartLine, label: 'Team Business', path: ROUTES.CLIENT_TEAM_BUSINESS },
    // { icon: FaChartLine, label: 'Individual Business', path: ROUTES.CLIENT_INDIVIDUAL_BUSINESS },
    { icon: FaCrown, label: "Royalties", path: ROUTES.CLIENT_ROYALTIES },
    { icon: FaGift, label: "Bonuses", path: ROUTES.CLIENT_BONUSES },
    { icon: FaUsers, label: "My Team", path: ROUTES.CLIENT_MY_TEAM },
    { icon: FaFileAlt, label: "Reports", path: ROUTES.CLIENT_REPORTS },
    {
      icon: FaHistory,
      label: "Rewards History",
      path: ROUTES.CLIENT_HISTORY_REWARDS,
    },
    {
      icon: FaHistory,
      label: "Staking History",
      path: ROUTES.CLIENT_HISTORY_STAKING,
    },
    { icon: FaUser, label: "Profile", path: ROUTES.CLIENT_PROFILE },
    { icon: FaShieldAlt, label: "2FA", path: ROUTES.CLIENT_2FA },
    {
      icon: FaKey,
      label: "Change Password",
      path: ROUTES.CLIENT_CHANGE_PASSWORD,
    },
  ];

  return (
    <div className="w-64 bg-[#222831] h-screen fixed left-0 top-0 border-r border-[#4b5563]">
      <div className="p-4 flex flex-col h-full">
        <div className="pb-4">
          <Logo variant="sidebar" />
        </div>
        {/* Navigation Menu */}
        <nav className="space-y-1 flex-1 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#00ADB5]/10 text-[#00ADB5]"
                      : "text-gray-300 hover:bg-[#393E46]"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-[#393E46] transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ClientSidebar;
