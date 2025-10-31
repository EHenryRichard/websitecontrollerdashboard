'use client';
import {
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiClock,
} from 'react-icons/fi';
import { useGlobalUI } from '../../contexts/GlobalUIProvider';

export default function NotificationPanel() {
  const { notificationOpen, setNotificationOpen } =
    useGlobalUI();

  // Mock notifications - replace with real data later
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Backup Completed',
      message:
        'Client ABC Website backup completed successfully',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Message Sent',
      message: 'Scheduled message sent to Client XYZ admin',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Storage Warning',
      message: 'You are using 80% of your storage space',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 4,
      type: 'error',
      title: 'Backup Failed',
      message:
        'Client DEF Portal backup failed - check credentials',
      time: '1 day ago',
      read: true,
    },
    {
      id: 5,
      type: 'info',
      title: 'Message Sent',
      message: 'Scheduled message sent to Client XYZ admin',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 6,
      type: 'warning',
      title: 'Storage Warning',
      message: 'You are using 80% of your storage space',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 7,
      type: 'error',
      title: 'Backup Failed',
      message:
        'Client DEF Portal backup failed - check credentials',
      time: '1 day ago',
      read: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <FiCheckCircle
            className="text-green-500"
            size={20}
          />
        );
      case 'warning':
        return (
          <FiAlertCircle
            className="text-yellow-500"
            size={20}
          />
        );
      case 'error':
        return (
          <FiAlertCircle
            className="text-red-500"
            size={20}
          />
        );
      default:
        return (
          <FiInfo className="text-blue-500" size={20} />
        );
    }
  };

  if (!notificationOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setNotificationOpen(false)}
      />

      {/* Notification Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-[#111111] border-l border-[#222222] shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#222222] bg-[#0a0a0a]">
          <h2 className="text-lg font-bold">
            Notifications
          </h2>
          <button
            onClick={() => setNotificationOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiCheckCircle
                size={48}
                className="mb-4 opacity-20"
              />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    notification.read
                      ? 'bg-[#0a0a0a] border-[#222222] opacity-60'
                      : 'bg-[#1a1a1a] border-orange-500/20'
                  } hover:bg-[#252525]`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-semibold">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiClock size={12} />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222222] bg-[#0a0a0a]">
          <button className="w-full py-2 text-sm text-orange-500 hover:text-orange-400 font-medium">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
