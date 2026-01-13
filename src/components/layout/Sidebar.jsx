import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPaperPlane,
  FaTrophy,
  FaUsers,
  FaFileInvoiceDollar,
  FaBuilding,
  FaEnvelope,
  FaList,
  FaCog,
  FaUserShield,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useState } from "react";
import { ROUTES } from "../../utils/constants";
import Logo from "../common/Logo";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    manageUsers: false,
    deposits: false,
    withdrawals: false,
    support: false,
    report: false,
    investmentPlans: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { icon: FaHome, label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD },
    {
      icon: FaTrophy,
      label: "User Ranking",
      path: ROUTES.ADMIN_RANKING,
    },
    {
      icon: FaPaperPlane,
      label: "Investment Plans",
      path: ROUTES.ADMIN_PLANS_ROI,
      submenu: [
        { label: "ROI Configuration", path: ROUTES.ADMIN_PLANS_ROI },
        { label: "Staking Plans", path: ROUTES.ADMIN_PLANS_STAKING },
      ],
      menuKey: "investmentPlans",
    },
    {
      icon: FaUserShield,
      label: "Manage Admins",
      path: "/admin/admins",
      submenu: [
        { label: "All Admins", path: "/admin/admins" },
        { label: "Create Admin", path: "/admin/admins/create" },
      ],
      menuKey: "manageAdmins",
    },
    {
      icon: FaUsers,
      label: "Manage Users",
      path: ROUTES.ADMIN_USERS_ALL,
      badge: 878,
      submenu: [
        { label: "Active Users", path: ROUTES.ADMIN_USERS_ACTIVE },
        { label: "Banned Users", path: ROUTES.ADMIN_USERS_BANNED },
        { label: "Un-Invested Users", path: "/admin/users/uninvested" },
        {
          label: "Email Unverified",
          path: ROUTES.ADMIN_USERS_EMAIL_UNVERIFIED,
          badge: 23,
        },
        {
          label: "Mobile Unverified",
          path: ROUTES.ADMIN_USERS_MOBILE_UNVERIFIED,
          badge: 1,
        },
        {
          label: "KYC Unverified",
          path: ROUTES.ADMIN_USERS_KYC_UNVERIFIED,
          badge: 878,
        },
        {
          label: "KYC Pending",
          path: ROUTES.ADMIN_USERS_KYC_PENDING,
          badge: 117,
        },
        { label: "Paid Users", path: ROUTES.ADMIN_USERS_PAID },
        { label: "All Users", path: ROUTES.ADMIN_USERS_ALL },
        {
          label: "Send Notification",
          path: ROUTES.ADMIN_USERS_SEND_NOTIFICATION,
        },
      ],
      menuKey: "manageUsers",
    },
    {
      icon: FaFileInvoiceDollar,
      label: "Deposits",
      path: ROUTES.ADMIN_DEPOSITS_ALL,
      badge: 301,
      submenu: [
        {
          label: "Pending Deposits",
          path: ROUTES.ADMIN_DEPOSITS_PENDING,
          badge: 301,
        },
        { label: "Approved Deposits", path: ROUTES.ADMIN_DEPOSITS_APPROVED },
        {
          label: "Successful Deposits",
          path: ROUTES.ADMIN_DEPOSITS_SUCCESSFUL,
        },
        { label: "Rejected Deposits", path: ROUTES.ADMIN_DEPOSITS_REJECTED },
        { label: "Initiated Deposits", path: ROUTES.ADMIN_DEPOSITS_INITIATED },
        { label: "All Deposits", path: ROUTES.ADMIN_DEPOSITS_ALL },
      ],
      menuKey: "deposits",
    },
    {
      icon: FaBuilding,
      label: "Withdrawals",
      path: ROUTES.ADMIN_WITHDRAWALS_ALL,
      badge: 26,
      submenu: [
        {
          label: "Pending Withdrawals",
          path: ROUTES.ADMIN_WITHDRAWALS_PENDING,
          badge: 26,
        },
        {
          label: "Approved Withdrawals",
          path: ROUTES.ADMIN_WITHDRAWALS_APPROVED,
        },
        {
          label: "Rejected Withdrawals",
          path: ROUTES.ADMIN_WITHDRAWALS_REJECTED,
        },
        { label: "All Withdrawals", path: ROUTES.ADMIN_WITHDRAWALS_ALL },
      ],
      menuKey: "withdrawals",
    },
    {
      icon: FaEnvelope,
      label: "Support Ticket",
      path: ROUTES.ADMIN_SUPPORT_ALL,
      badge: 65,
      submenu: [
        {
          label: "Pending Ticket",
          path: ROUTES.ADMIN_SUPPORT_PENDING,
          badge: 65,
        },
        { label: "Closed Ticket", path: ROUTES.ADMIN_SUPPORT_CLOSED },
        { label: "Answered Ticket", path: ROUTES.ADMIN_SUPPORT_ANSWERED },
        { label: "All Ticket", path: ROUTES.ADMIN_SUPPORT_ALL },
      ],
      menuKey: "support",
    },
    {
      icon: FaList,
      label: "Report",
      path: ROUTES.ADMIN_REPORTS_TRANSACTION,
      submenu: [
        {
          label: "Transaction History",
          path: ROUTES.ADMIN_REPORTS_TRANSACTION,
        },
        { label: "Invest Log", path: ROUTES.ADMIN_REPORTS_INVEST },
        { label: "BV Log", path: ROUTES.ADMIN_REPORTS_BV },
        { label: "Referral Commission", path: ROUTES.ADMIN_REPORTS_REFERRAL },
        { label: "Level Commission", path: ROUTES.ADMIN_REPORTS_LEVEL_COMMISSION },
        { label: "Login History", path: ROUTES.ADMIN_REPORTS_LOGIN },
        {
          label: "Notification History",
          path: ROUTES.ADMIN_REPORTS_NOTIFICATION,
        },
      ],
      menuKey: "report",
    },
    { icon: FaCog, label: "System Setting", path: ROUTES.ADMIN_SETTINGS },
  ];

  return (
    <div
      className="w-64 bg-[var(--sidebar-bg)] text-[var(--text-primary)] h-screen fixed left-0 top-0 border-r border-[var(--border-color)] transition-colors duration-200"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="mb-8">
          <Logo variant="sidebar" />
        </div>

        <nav className="space-y-1 -mx-6 flex-1 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isOpen = openMenus[item.menuKey];

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.menuKey)}
                    className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-[#f59e0b] text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}+
                        </span>
                      )}
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>

                  <div
                    className={`mt-1 space-y-1 overflow-hidden sidebar-submenu ${
                      isOpen ? "open" : "closed"
                    }`}
                  >
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-6 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors ${
                            isActive 
                              ? "bg-[#00ADB5] text-white" 
                              : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                          }`
                        }
                      >
                        <span>{subItem.label}</span>
                        {subItem.badge && (
                          <span className="bg-[#f59e0b] text-white text-xs px-2 py-0.5 rounded-full">
                            {subItem.badge}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#00ADB5] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#f59e0b] text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}+
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
