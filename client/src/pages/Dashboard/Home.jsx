import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Appbar from '../../components/Appbar';
import Balance from '../../components/Balance';
import Users from '../../components/Users';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [user, setUser] = useState({ name: '', balance: 0, id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getUserData/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          toast.error('Failed to fetch user data');
          return;
        }

        const data = await response.json();
        if (!data.success) {
          toast.error('Failed to fetch user data');
          return;
        }

        const { firstName, lastName, balance, _id } = data.user;
        setUser({
          name: `${firstName} ${lastName}`,
          balance: balance,
          id: _id
        });
      } catch (error) {
        toast.error('Error fetching user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={user.name} />
        <div>
          <Balance balance={user.balance} name={user.name} />
        </div>
        <div className='my-10'>
          <h2 className='m-8 text-2xl font-bold'>People</h2>
          <Users currentUserID={user.id} />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;