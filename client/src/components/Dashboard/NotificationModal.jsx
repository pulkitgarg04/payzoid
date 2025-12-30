import { useEffect, useState } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-hot-toast";

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

  const formatNotificationDate = (date) => {
    const today = new Date();
    const notificationDate = new Date(date);

    const isToday = notificationDate.toDateString() === today.toDateString();
    const isYesterday = notificationDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return notificationDate.toLocaleDateString();
  };

  const handleClearNotifications = async () => {
    try {
      const confirmClear = window.confirm("Are you sure you want to clear all notifications?");
      if (!confirmClear) {
        return;
      }
      const response = await fetch(`${API_URL}/deleteAllNotifications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications([]);
        toast.success("Notifications cleared successfully");
      } else {
        console.error("Failed to clear notifications: ", response.status);
      }
    } catch (error) {
      toast.error("Error clearing notifications: ", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${API_URL}/getNotifications`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications);
          } else {
            console.error("Failed to fetch notifications:", response.status);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-90 transition-opacity z-50 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div
        className={`flex items-center justify-center h-full`}
      >
        <div
          className={`bg-gray-100 dark:bg-gray-900 rounded-xl mx-auto p-6 shadow-md w-full max-w-md`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="inline-flex items-center justify-between w-full mb-4">
            <h3 className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-white">
              Notifications
            </h3>
            <button
              className="py-1 px-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 focus:outline-none"
              onClick={onClose}
            >
              <IoIosCloseCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 max-h-[calc(100vh-250px)] mb-4
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            {notifications.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="mt-3 px-6 py-4 bg-white rounded-lg shadow w-full dark:bg-gray-800"
                >
                  <div className="inline-flex items-center justify-between w-full">
                    <div className="inline-flex items-center">
                      <FaMoneyBillTransfer className="w-6 h-6 mr-3 text-blue-500 dark:text-blue-300" />
                      <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatNotificationDate(notification.timestamp)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                </div>
              ))
            ) : (
              <p className="mt-8 font-medium text-gray-500 text-sm sm:text-base dark:text-gray-400">
                No new notifications
              </p>
            )}
          </div>

          <button
            className="inline-flex text-sm bg-red-100 justify-center px-4 py-2 w-full text-red-500 items-center rounded font-medium focus:outline-none transform transition-transform duration-700 hover:bg-red-500 hover:text-white dark:bg-red-500 dark:text-white dark:hover:bg-red-200 dark:hover:text-red-600"
            onClick={handleClearNotifications}
          >
            <TiDelete className="w-5 h-5 mr-2" />
            Clear all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;