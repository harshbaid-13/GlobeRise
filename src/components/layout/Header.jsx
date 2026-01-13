import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { FaGlobe, FaBell, FaWrench, FaCheck, FaChevronDown, FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import Button from '../common/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="bg-[var(--bg-secondary)] shadow-sm border-b border-[var(--border-color)] px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] w-4 h-4" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] placeholder-[var(--text-tertiary)] transition-colors duration-200"
          />
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] transition-all duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <FaSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FaMoon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <button className="p-2 text-[var(--text-secondary)] hover:text-[#00ADB5] transition-colors">
            <FaGlobe className="w-5 h-5" />
          </button>

          <button className="relative p-2 text-[var(--text-secondary)] hover:text-[#00ADB5] transition-colors">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              9+
            </span>
          </button>

          <button className="p-2 text-[var(--text-secondary)] hover:text-[#00ADB5] transition-colors">
            <FaWrench className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-[#00ADB5] rounded-full flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-white" />
              </div>
              <span>{user?.name || user?.username || 'admin'}</span>
              <FaChevronDown className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--border-color)] py-1 z-50">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#ef4444] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;

