import { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { FaCheckDouble, FaBell, FaCheck } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const Notifications = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ROI_CREDIT':
        return '💰';
      case 'COMMISSION':
        return '💵';
      case 'RANK_PROMOTION':
        return '🏆';
      case 'WITHDRAWAL_APPROVED':
        return '✅';
      case 'WITHDRAWAL_REJECTED':
        return '❌';
      case 'INVESTMENT_CREATED':
        return '📦';
      case 'STAKING_MATURED':
        return '⏰';
      case 'ROYALTY_DISTRIBUTED':
        return '👑';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ROI_CREDIT':
      case 'COMMISSION':
        return 'border-green-500/50 bg-green-500/10';
      case 'RANK_PROMOTION':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'WITHDRAWAL_APPROVED':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'WITHDRAWAL_REJECTED':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-[#4b5563] bg-[#393E46]';
    }
  };

  if (loading && notifications.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ADB5] text-white rounded-lg hover:bg-[#00d4e0] transition-colors"
          >
            <FaCheckDouble className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-[#393E46] rounded-lg border border-[#4b5563] p-12 text-center">
          <FaBell className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
          <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-[#393E46] rounded-lg border p-4 transition-all ${
                !notification.read ? getNotificationColor(notification.type) : 'border-[#4b5563]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#00ADB5] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-2">{notification.message}</p>
                      <p className="text-gray-500 text-sm">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-[#00ADB5] transition-colors"
                        title="Mark as read"
                      >
                        <FaCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

