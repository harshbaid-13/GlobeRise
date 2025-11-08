import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaDesktop } from 'react-icons/fa';
import { depositService } from '../../../services/depositService';
import { formatCurrency, formatDateWithRelative } from '../../../utils/formatters';
import Loading from '../../../components/common/Loading';

const DepositsList = ({ status, title }) => {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const dateDropdownRef = useRef(null);

  const getDateRange = (range) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);

    switch (range) {
      case 'Today':
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'Yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'Last 7 Days':
        start.setDate(start.getDate() - 6);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'Last 15 Days':
        start.setDate(start.getDate() - 14);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'Last 30 Days':
        start.setDate(start.getDate() - 29);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'This Month':
        start.setDate(1);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'Last Month':
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'Last 6 Months':
        start.setMonth(start.getMonth() - 5);
        start.setDate(1);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      case 'This Year':
        start.setMonth(0, 1);
        return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
      default:
        return { start: '', end: '' };
    }
  };

  const handleDateRangeSelect = (range) => {
    if (range === 'Custom Range') {
      setShowCustomRange(true);
      setShowDateDropdown(false);
      setSelectedDateRange('Custom Range');
    } else {
      const { start, end } = getDateRange(range);
      setStartDate(start);
      setEndDate(end);
      setSelectedDateRange(range);
      setShowCustomRange(false);
      setShowDateDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    loadDeposits();
  }, [status]);

  const loadDeposits = async () => {
    try {
      let data;
      if (status) {
        data = await depositService.getDepositsByStatus(status);
      } else {
        data = await depositService.getAllDeposits();
      }
      setDeposits(data);
    } catch (error) {
      console.error('Error loading deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (id) => {
    navigate(`/admin/deposit/details/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch = 
      !searchQuery ||
      deposit.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDateRange = 
      (!startDate && !endDate) ||
      ((!startDate || new Date(deposit.createdAt) >= new Date(startDate)) &&
       (!endDate || new Date(deposit.createdAt) <= new Date(endDate)));
    
    return matchesSearch && matchesDateRange;
  });

  if (loading) return <Loading size="lg" />;

  const dateRangeOptions = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last 15 Days',
    'Last 30 Days',
    'This Month',
    'Last Month',
    'Last 6 Months',
    'This Year',
    'Custom Range'
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title || 'Deposits'}</h1>
          
          {/* Search and Filter Bar */}
          <div className="flex gap-3">
            {/* Username/TRX Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username / TRX"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Date Range Filter */}
            <div className="relative" ref={dateDropdownRef}>
              <input
                type="text"
                placeholder="Start Date - End Date"
                value={selectedDateRange || (startDate && endDate ? `${startDate} - ${endDate}` : '') || ''}
                readOnly
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="w-48 px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-900 placeholder:text-gray-400"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              
              {showDateDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                  {dateRangeOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleDateRangeSelect(option)}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-purple-100 ${
                        selectedDateRange === option ? 'bg-purple-600 text-white hover:bg-purple-600' : 'text-gray-900'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
              
              {showCustomRange && (
                <div className="absolute z-20 top-full left-0 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (e.target.value && endDate) {
                          setSelectedDateRange('');
                        }
                      }}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (startDate && e.target.value) {
                          setSelectedDateRange('');
                        }
                      }}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Gateway | Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Initiated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Conversion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No deposits found
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((deposit) => {
                    const dateInfo = formatDateWithRelative(deposit.createdAt);
                    return (
                      <tr key={deposit.id} className="hover:bg-gray-50">
                        {/* Gateway | Transaction */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-blue-600 font-medium">{deposit.gateway || deposit.method}</div>
                            <div className="text-blue-500 text-xs">{deposit.transactionId}</div>
                          </div>
                        </td>
                        
                        {/* Initiated */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>{dateInfo.dateTime}</div>
                            <div className="text-gray-500 text-xs">{dateInfo.relative}</div>
                          </div>
                        </td>
                        
                        {/* User */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900">{deposit.userName || 'N/A'}</div>
                            <div 
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => navigate(`/admin/users/details/${deposit.userId}`)}
                            >
                              @{deposit.username || 'N/A'}
                            </div>
                          </div>
                        </td>
                        
                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>
                              {formatCurrency(deposit.amount || 0)}
                              <span className="text-red-600 ml-2">
                                + {formatCurrency(deposit.charge || 0)}
                              </span>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(deposit.afterCharge || deposit.amount || 0)}
                            </div>
                          </div>
                        </td>
                        
                        {/* Conversion */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>
                              ${deposit.conversionRate || 1.00} = 1.00 {deposit.conversionCurrency || 'USD'}
                            </div>
                            <div className="text-gray-600">
                              {formatCurrency(deposit.afterConversion || deposit.afterCharge || deposit.amount || 0)} {deposit.conversionCurrency || 'USD'}
                            </div>
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                            {deposit.status}
                          </span>
                        </td>
                        
                        {/* Action */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDetailsClick(deposit.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaDesktop className="mr-2" />
                            Details
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
    </div>
  );
};

export default DepositsList;

