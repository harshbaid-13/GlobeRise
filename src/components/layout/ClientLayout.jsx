import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import Button from '../common/Button';

const ClientLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-[#0d1421]">
      <nav className="bg-[#1a1f2e] border-b border-[#374151] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-[#00d4ff]">MLMLab</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to={ROUTES.CLIENT_DASHBOARD}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.CLIENT_PLANS}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Plans
                </Link>
                <Link
                  to={ROUTES.CLIENT_PROFILE}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to={ROUTES.CLIENT_DEPOSIT}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Deposit
                </Link>
                <Link
                  to={ROUTES.CLIENT_WITHDRAW}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Withdraw
                </Link>
                <Link
                  to={ROUTES.CLIENT_TRANSACTIONS}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Transactions
                </Link>
                <Link
                  to={ROUTES.CLIENT_SUPPORT}
                  className="border-transparent text-gray-400 hover:border-[#00d4ff] hover:text-[#00d4ff] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">{user?.name || user?.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default ClientLayout;

