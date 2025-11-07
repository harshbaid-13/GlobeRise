import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaGlobe, FaBell, FaWrench, FaCheck, FaChevronDown } from 'react-icons/fa';
import Button from '../common/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="bg-[#1a1f2e] shadow-sm border-b border-[#374151] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full px-4 py-2 bg-[#252a3a] border border-[#374151] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-[#00d4ff] transition-colors">
            <FaGlobe className="w-5 h-5" />
          </button>

          <button className="relative p-2 text-gray-400 hover:text-[#00d4ff] transition-colors">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              9+
            </span>
          </button>

          <button className="p-2 text-gray-400 hover:text-[#00d4ff] transition-colors">
            <FaWrench className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-[#252a3a] rounded-lg transition-colors"
            >
              <span>{user?.name || user?.username || 'admin'}</span>
              <FaChevronDown className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#252a3a] rounded-lg shadow-lg border border-[#374151] py-1 z-50">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1a1f2e] transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1a1f2e] transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#ef4444] hover:bg-[#1a1f2e] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <Button variant="primary" className="flex items-center" size="sm">
            <FaWrench className="mr-2" />
            Cron Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;

