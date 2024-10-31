import { useEffect, useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import AccountLogsTable from '../../components/AccountLogs/AccountLogsTable';

const AccountLogs = () => {
  const [logs, setLogs] = useState([]);
  const { user } = useAuthStore();
  const name = `${user.firstName} ${user.lastName}`;

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You need to be logged in to view logs.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getUserLogs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user logs');
      }

      setLogs(data.userLogs);
    } catch (error) {
      toast.error(error.message || 'Error fetching user logs');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={name} />
        <h2 className='text-2xl font-bold m-8'>Account Logs</h2>
        <AccountLogsTable logs={logs} />
      </div>
    </div>
  );
};

export default AccountLogs;