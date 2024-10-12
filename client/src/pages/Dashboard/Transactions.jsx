import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Appbar from '../../components/Appbar';
import TransactionTable from '../../components/TransactionTable';
import toast, { Toaster } from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

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
    <div className="flex">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={"Pulkit Garg"} />
        <h2 className='text-2xl font-bold m-8'>Transactions</h2>
        <TransactionTable transactions={transactions} />
      </div>
      <Toaster />
    </div>
  );
};

export default Transactions;