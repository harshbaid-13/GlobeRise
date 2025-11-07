import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaPaperPlane,
  FaKey,
  FaTrophy,
  FaUsers,
  FaFileInvoiceDollar,
  FaBuilding,
  FaEnvelope,
  FaList,
  FaThumbsUp,
  FaCog,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { useState } from 'react';
import { ROUTES } from '../../utils/constants';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    manageUsers: false,
    deposits: false,
    withdrawals: false,
    support: false,
    report: false,
    extra: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { icon: FaPaperPlane, label: 'Plans', path: ROUTES.ADMIN_PLANS },
    {
      icon: FaKey,
      label: 'Manage Pins',
      path: ROUTES.ADMIN_PINS_ALL,
      submenu: [
        { label: 'All Pins', path: ROUTES.ADMIN_PINS_ALL },
        { label: 'User Pins', path: ROUTES.ADMIN_PINS_USER },
        { label: 'Admin Pins', path: ROUTES.ADMIN_PINS_ADMIN },
        { label: 'Used Pins', path: ROUTES.ADMIN_PINS_USED },
        { label: 'Unused Pins', path: ROUTES.ADMIN_PINS_UNUSED },
      ],
      menuKey: 'managePins',
    },
    { icon: FaTrophy, label: 'User Ranking', path: ROUTES.ADMIN_RANKING },
    {
      icon: FaUsers,
      label: 'Manage Users',
      path: ROUTES.ADMIN_USERS_ALL,
      badge: 878,
      submenu: [
        { label: 'Active Users', path: ROUTES.ADMIN_USERS_ACTIVE },
        { label: 'Banned Users', path: ROUTES.ADMIN_USERS_BANNED },
        { label: 'Email Unverified', path: ROUTES.ADMIN_USERS_EMAIL_UNVERIFIED, badge: 23 },
        { label: 'Mobile Unverified', path: ROUTES.ADMIN_USERS_MOBILE_UNVERIFIED, badge: 1 },
        { label: 'KYC Unverified', path: ROUTES.ADMIN_USERS_KYC_UNVERIFIED, badge: 878 },
        { label: 'KYC Pending', path: ROUTES.ADMIN_USERS_KYC_PENDING, badge: 117 },
        { label: 'Paid Users', path: ROUTES.ADMIN_USERS_PAID },
        { label: 'All Users', path: ROUTES.ADMIN_USERS_ALL },
        { label: 'Send Notification', path: ROUTES.ADMIN_USERS_SEND_NOTIFICATION },
      ],
      menuKey: 'manageUsers',
    },
    {
      icon: FaFileInvoiceDollar,
      label: 'Deposits',
      path: ROUTES.ADMIN_DEPOSITS_ALL,
      badge: 301,
      submenu: [
        { label: 'Pending Deposits', path: ROUTES.ADMIN_DEPOSITS_PENDING, badge: 301 },
        { label: 'Approved Deposits', path: ROUTES.ADMIN_DEPOSITS_APPROVED },
        { label: 'Successful Deposits', path: ROUTES.ADMIN_DEPOSITS_SUCCESSFUL },
        { label: 'Rejected Deposits', path: ROUTES.ADMIN_DEPOSITS_REJECTED },
        { label: 'Initiated Deposits', path: ROUTES.ADMIN_DEPOSITS_INITIATED },
        { label: 'All Deposits', path: ROUTES.ADMIN_DEPOSITS_ALL },
      ],
      menuKey: 'deposits',
    },
    {
      icon: FaBuilding,
      label: 'Withdrawals',
      path: ROUTES.ADMIN_WITHDRAWALS_ALL,
      badge: 26,
      submenu: [
        { label: 'Pending Withdrawals', path: ROUTES.ADMIN_WITHDRAWALS_PENDING, badge: 26 },
        { label: 'Approved Withdrawals', path: ROUTES.ADMIN_WITHDRAWALS_APPROVED },
        { label: 'Rejected Withdrawals', path: ROUTES.ADMIN_WITHDRAWALS_REJECTED },
        { label: 'All Withdrawals', path: ROUTES.ADMIN_WITHDRAWALS_ALL },
      ],
      menuKey: 'withdrawals',
    },
    {
      icon: FaEnvelope,
      label: 'Support Ticket',
      path: ROUTES.ADMIN_SUPPORT_ALL,
      badge: 65,
      submenu: [
        { label: 'Pending Ticket', path: ROUTES.ADMIN_SUPPORT_PENDING, badge: 65 },
        { label: 'Closed Ticket', path: ROUTES.ADMIN_SUPPORT_CLOSED },
        { label: 'Answered Ticket', path: ROUTES.ADMIN_SUPPORT_ANSWERED },
        { label: 'All Ticket', path: ROUTES.ADMIN_SUPPORT_ALL },
      ],
      menuKey: 'support',
    },
    {
      icon: FaList,
      label: 'Report',
      path: ROUTES.ADMIN_REPORTS_TRANSACTION,
      submenu: [
        { label: 'Transaction History', path: ROUTES.ADMIN_REPORTS_TRANSACTION },
        { label: 'Invest Log', path: ROUTES.ADMIN_REPORTS_INVEST },
        { label: 'BV Log', path: ROUTES.ADMIN_REPORTS_BV },
        { label: 'Referral Commission', path: ROUTES.ADMIN_REPORTS_REFERRAL },
        { label: 'Binary Commission', path: ROUTES.ADMIN_REPORTS_BINARY },
        { label: 'Login History', path: ROUTES.ADMIN_REPORTS_LOGIN },
        { label: 'Notification History', path: ROUTES.ADMIN_REPORTS_NOTIFICATION },
      ],
      menuKey: 'report',
    },
    { icon: FaThumbsUp, label: 'Subscribers', path: ROUTES.ADMIN_SUBSCRIBERS },
    { icon: FaCog, label: 'System Setting', path: ROUTES.ADMIN_SETTINGS },
    {
      icon: FaList,
      label: 'Extra',
      path: ROUTES.ADMIN_EXTRA_APPLICATION,
      submenu: [
        { label: 'Application', path: ROUTES.ADMIN_EXTRA_APPLICATION },
        { label: 'Server', path: ROUTES.ADMIN_EXTRA_SERVER },
        { label: 'Cache', path: ROUTES.ADMIN_EXTRA_CACHE },
        { label: 'Update', path: ROUTES.ADMIN_EXTRA_UPDATE },
        { label: 'Report & Request', path: ROUTES.ADMIN_EXTRA_REPORT_REQUEST },
      ],
      menuKey: 'extra',
    },
  ];

  return (
    <div className="w-64 bg-[#1a1f2e] text-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-[#374151]">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-[#00d4ff] rounded-lg flex items-center justify-center">
            <FaUsers className="text-xl text-[#0d1421]" />
          </div>
          <h1 className="text-xl font-bold text-white">MLMLab</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isOpen = openMenus[item.menuKey];

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleMenu(item.menuKey)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#252a3a] transition-colors text-gray-300 hover:text-white"
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

                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.label}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-2 text-sm rounded-lg hover:bg-[#252a3a] transition-colors text-gray-400 hover:text-white ${isActive ? 'bg-[#252a3a] text-[#00d4ff]' : ''
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
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg hover:bg-[#252a3a] transition-colors text-gray-300 hover:text-white ${isActive ? 'bg-[#252a3a] text-[#00d4ff]' : ''
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

