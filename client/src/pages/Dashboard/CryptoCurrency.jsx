import { useEffect, useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import TransactionTable from '../../components/Transactions/TransactionTable';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import CryptoCurrencyTable from '../../components/CryptoCurrency/CryptoCurrencyTable';

const CryptoCurrency = () => {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuthStore();
  const name = `${user.firstName} ${user.lastName}`;

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You need to be logged in to view transactions.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      setTransactions(data.transactions);
    } catch (error) {
      toast.error(error.message || 'Error fetching transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={name} />
        <h2 className='text-2xl font-bold m-8'>Latest CryptoCurrency Price</h2>
        <CryptoCurrencyTable />
      </div>
    </div>
  );
};

export default CryptoCurrency;