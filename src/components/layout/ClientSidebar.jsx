import { NavLink, useNavigate } from 'react-router-dom';
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
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const ClientSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: ROUTES.CLIENT_DASHBOARD },
    { icon: FaBuilding, label: 'Plan', path: ROUTES.CLIENT_PLANS },
    { icon: FaFileAlt, label: 'Bv Log', path: ROUTES.CLIENT_BV_LOG },
    { icon: FaUsers, label: 'My Referrals', path: ROUTES.CLIENT_MY_REFERRALS },
    { icon: FaSitemap, label: 'My Tree', path: ROUTES.CLIENT_MY_TREE },
    { icon: FaWallet, label: 'Deposit', path: ROUTES.CLIENT_DEPOSIT },
    { icon: FaPiggyBank, label: 'Withdraw', path: ROUTES.CLIENT_WITHDRAW },
    { icon: FaExchangeAlt, label: 'Balance Transfer', path: ROUTES.CLIENT_BALANCE_TRANSFER },
    { icon: FaCreditCard, label: 'E-pin Recharge', path: ROUTES.CLIENT_EPIN_RECHARGE },
    { icon: FaList, label: 'Transactions', path: ROUTES.CLIENT_TRANSACTIONS },
    { icon: FaTrophy, label: 'Ranking', path: ROUTES.CLIENT_RANKING },
    { icon: FaTicketAlt, label: 'Support Ticket', path: ROUTES.CLIENT_SUPPORT },
    { icon: FaShieldAlt, label: '2FA', path: ROUTES.CLIENT_2FA },
    { icon: FaUser, label: 'Profile', path: ROUTES.CLIENT_PROFILE },
    { icon: FaKey, label: 'Change Password', path: ROUTES.CLIENT_CHANGE_PASSWORD },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-200">
      <div className="p-4">
        {/* Account Balance Section */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            ACCOUNT BALANCE
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {formatCurrency(user?.balance || 0)}
          </div>
          <div className="flex gap-2">
            <NavLink
              to={ROUTES.CLIENT_DEPOSIT}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded text-center hover:bg-blue-700 transition-colors"
            >
              Deposit
            </NavLink>
            <NavLink
              to={ROUTES.CLIENT_WITHDRAW}
              className="flex-1 bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded text-center hover:bg-gray-800 transition-colors"
            >
              Withdraw
            </NavLink>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
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
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

