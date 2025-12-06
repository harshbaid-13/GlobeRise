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
  FaCoins,
  FaBook,
  FaRocket,
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
    { icon: FaRocket, label: "Investments", path: "/client/investments" },
    { icon: FaTrophy, label: "Ranking", path: ROUTES.CLIENT_RANKING },
    { icon: FaUsers, label: "My Team", path: ROUTES.CLIENT_MY_TEAM },
    { icon: FaGift, label: "Rewards", path: "/client/rewards" },
    { icon: FaPiggyBank, label: "Withdraw", path: ROUTES.CLIENT_WITHDRAW },
    { icon: FaHistory, label: "Transaction History", path: "/client/transaction-history" },
    { icon: FaBook, label: "Rules", path: "/client/rules" },
    { icon: FaFileAlt, label: "Reports", path: ROUTES.CLIENT_REPORTS },
    { icon: FaTicketAlt, label: "Support", path: ROUTES.CLIENT_SUPPORT },
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

        </nav>
      </div>
    </div>
  );
};

export default ClientSidebar;
