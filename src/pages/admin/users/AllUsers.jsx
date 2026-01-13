import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFileAlt } from 'react-icons/fa';
import { userService } from '../../../services/userService';
import { formatCurrency, formatDateWithRelative } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';
import Button from '../../../components/common/Button';

const AllUsers = ({ loadUsersFn, title = 'All Users' }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [loadUsersFn]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const loadUsers = async () => {
    try {
      const loadFn = loadUsersFn || userService.getAllUsers;
      const data = await loadFn();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => {
      return (
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  };

  const handleDetailsClick = (userId) => {
    navigate(`/admin/users/details/${userId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterUsers();
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <div className="bg-[var(--card-bg)] rounded-lg shadow-md border border-[var(--border-color)] p-6">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Username / Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
            />
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2 flex items-center space-x-2"
            >
              <FaSearch />
            </Button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#00ADB5]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Email-Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Joined At
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right pr-9 text-xs font-bold text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[var(--text-tertiary)]">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const dateInfo = formatDateWithRelative(user.createdAt);
                  return (
                    <tr key={user.id} className={`hover:bg-[var(--bg-hover)] ${index % 2 === 0 ? 'bg-[var(--card-bg)]' : 'bg-[var(--bg-secondary)]'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--text-primary)]">
                          <div className="font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</div>
                          <div className="text-[var(--text-tertiary)]">@{user.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--text-primary)]">
                          <div>{user.email || 'N/A'}</div>
                          <div>{user.mobile || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--text-primary)]">{user.countryCode || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--text-primary)]">
                          <div>{dateInfo.dateTime || user.createdAt}</div>
                          <div className="text-[var(--text-tertiary)]">{dateInfo.relative || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--text-primary)]">{formatCurrency(user.balance || 0)}</div>
                      </td>
                      <td className="px-6 py-4 float-right whitespace-nowrap">
                        <button
                          onClick={() => handleDetailsClick(user.id)}
                          className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors"
                        >
                          <FaFileAlt className="text-blue-700 dark:text-blue-400" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

