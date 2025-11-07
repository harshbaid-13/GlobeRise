import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const ClientHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">GlobeRise</h1>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-2">

          <button className="text-sm font-semibold text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors">
            Connect Wallet
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <FaUser className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;

