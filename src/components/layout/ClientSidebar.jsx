import { useState } from "react";
import { NavLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaPiggyBank,
  FaTrophy,
  FaTicketAlt,
  FaShieldAlt,
  FaUser,
  FaSignOutAlt,
  FaGift,
  FaHistory,
  FaBook,
  FaRocket,
  FaChevronDown,
  FaChevronRight,
  FaCoins,
  FaSitemap,
  FaNetworkWired,
  FaChartLine,
  FaCrown,
  FaMoneyBillWave,
  FaAward,
  FaWallet,
  FaExchangeAlt,
  FaCreditCard,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import Logo from "../common/Logo";

const ClientSidebar = ({ isOpen = false, onClose = () => { } }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [openMenus, setOpenMenus] = useState({});

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSubMenuClick = (path, tabParam) => {
    navigate(`${path}?tab=${tabParam}`);
    // Close mobile sidebar after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const menuItems = [
    {
      icon: FaHome,
      label: "Dashboard",
      path: ROUTES.CLIENT_DASHBOARD
    },
    {
      icon: FaRocket,
      label: "Investments",
      path: "/client/investments",
      submenus: [
        { label: "Package", tab: "packages" },
        { label: "Staking", tab: "staking" },
      ],
    },
    {
      icon: FaTrophy,
      label: "Ranking",
      path: ROUTES.CLIENT_RANKING
    },
    {
      icon: FaUsers,
      label: "My Team",
      path: ROUTES.CLIENT_MY_TEAM,
      // submenus: [
      //   { label: "Referrals", tab: "referrals" },
      //   { label: "Team", tab: "team" },
      //   { label: "Network Tree", tab: "tree" },
      // ],
    },
    {
      icon: FaGift,
      label: "Rewards",
      path: "/client/rewards",
      submenus: [
        { label: "ROI", tab: "roi" },
        { label: "Level Income", tab: "levelIncome" },
        { label: "Bonuses", tab: "bonuses" },
        { label: "Royalties", tab: "royalties" },
      ],
    },
    {
      icon: FaPiggyBank,
      label: "Withdrawal",
      path: ROUTES.CLIENT_WITHDRAW
    },
    {
      icon: FaHistory,
      label: "Transaction History",
      path: "/client/transaction-history",
      submenus: [
        { label: "All", tab: "ALL" },
        { label: "Deposits", tab: "DEPOSIT" },
        { label: "ROI", tab: "ROI" },
        { label: "Commissions", tab: "COMMISSION" },
        { label: "Transfers", tab: "TRANSFER" },
        { label: "Withdrawals", tab: "WITHDRAWAL" },
        { label: "Bonuses", tab: "RANK_BONUS" },
        { label: "Royalties", tab: "ROYALTY" },
        { label: "Investments", tab: "INVESTMENT" },
      ],
    },
    {
      icon: FaBook,
      label: "Rules",
      path: "/client/rules"
    },
    {
      icon: FaFileAlt,
      label: "Reports",
      path: ROUTES.CLIENT_REPORTS
    },
    {
      icon: FaUser,
      label: "Profile",
      path: ROUTES.CLIENT_PROFILE
    },
    {
      icon: FaShieldAlt,
      label: "2FA",
      path: ROUTES.CLIENT_2FA
    },
    {
      icon: FaTicketAlt,
      label: "Support",
      path: ROUTES.CLIENT_SUPPORT
    },
  ];

  return (
    <div
      className={`w-64 bg-[var(--sidebar-bg)] h-screen fixed left-0 top-0 border-r border-[var(--border-color)] z-50 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="pb-4 flex items-center justify-between">
          <Logo variant="sidebar" />
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close menu"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        {/* Navigation Menu */}
        <nav className="space-y-1 flex-1 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenus = item.submenus && item.submenus.length > 0;
            const isOpen = openMenus[item.label];
            const isActive = location.pathname === item.path;

            return (
              <div key={item.label}>
                {hasSubmenus ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? "bg-[#00ADB5]/10 text-[#00ADB5]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {isOpen ? (
                        <FaChevronDown className="w-4 h-4" />
                      ) : (
                        <FaChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenus.map((submenu) => {
                          const currentTab = searchParams.get('tab');
                          const isSubmenuActive = currentTab === submenu.tab;

                          return (
                            <button
                              key={submenu.label}
                              onClick={() =>
                                handleSubMenuClick(item.path, submenu.tab)
                              }
                              className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-colors ${isSubmenuActive
                                ? "text-[#00ADB5] bg-[#00ADB5]/10 font-semibold"
                                : "text-[var(--text-tertiary)] hover:text-[#00ADB5] hover:bg-[var(--bg-secondary)]"
                                }`}
                            >
                              <span className="ml-6">{submenu.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      // Close mobile sidebar after navigation
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? "bg-[#00ADB5]/10 text-[#00ADB5]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </div>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] w-full mt-2"
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
