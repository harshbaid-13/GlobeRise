import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { delay } from '../../utils/helpers';
import Loading from '../../components/common/Loading';

const BvLog = () => {
  const [bvLogs, setBvLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBvLogs();
  }, []);

  const loadBvLogs = async () => {
    await delay(500);
    // Mock BV log data
    const mockData = [
      {
        id: 1,
        date: new Date().toISOString(),
        type: 'Earned',
        amount: 100,
        description: 'Referral commission',
        status: 'completed',
      },
      {
        id: 2,
        date: new Date().toISOString(),
        type: 'Used',
        amount: 50,
        description: 'Binary commission',
        status: 'completed',
      },
    ];
    setBvLogs(mockData);
    setLoading(false);
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">BV Log</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bvLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No BV logs found
                  </td>
                </tr>
              ) : (
                bvLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {log.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {log.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{log.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          log.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BvLog;

