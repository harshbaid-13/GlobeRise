import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaKey, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const getInitials = () => {
    if (user?.profile?.firstName && user?.profile?.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#393E46] transition-colors"
      >
        <div className="w-8 h-8 bg-[#00ADB5] rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user?.profile?.avatarUrl ? (
            <img
              src={user.profile.avatarUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials()
          )}
        </div>
        <span className="text-white text-sm font-medium hidden md:block">
          {user?.profile?.firstName || user?.email?.split('@')[0] || 'User'}
        </span>
        <FaChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#393E46] border border-[#4b5563] rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2">
            <button
              onClick={() => {
                navigate(ROUTES.CLIENT_PROFILE);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:bg-[#4b5563] rounded transition-colors"
            >
              <FaUser className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                navigate(ROUTES.CLIENT_CHANGE_PASSWORD);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:bg-[#4b5563] rounded transition-colors"
            >
              <FaKey className="w-4 h-4" />
              <span>Change Password</span>
            </button>
            <div className="border-t border-[#4b5563] my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-400 hover:bg-[#4b5563] rounded transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

