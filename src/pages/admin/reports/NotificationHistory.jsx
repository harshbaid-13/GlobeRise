import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import { formatDate } from '../../../utils/formatters';
import { useState, useEffect } from 'react';
import { delay } from '../../../utils/helpers';
import Loading from '../../../components/common/Loading';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    await delay(500);
    setNotifications([]);
    setLoading(false);
  };

  const columns = [
    { header: 'User ID', accessor: 'userId' },
    { header: 'Message', accessor: 'message' },
    { header: 'Type', accessor: 'type' },
    { header: 'Date', accessor: 'createdAt', render: (value) => formatDate(value) },
  ];

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification History</h1>
      <Card>
        <Table columns={columns} data={notifications} />
      </Card>
    </div>
  );
};

export default NotificationHistory;

