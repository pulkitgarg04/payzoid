import { useEffect, useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import Balance from '../../components/Dashboard/Balance';
import Users from '../../components/Users';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const name = `${user.firstName} ${user.lastName}`;

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }

  // }, [navigate]);

  return (
    <div className="flex">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={name} />
        <div>
          <Balance balance={user.balance} name={name} />
        </div>
        <div className='my-10'>
          <h2 className='m-8 text-2xl font-bold'>People</h2>
          <Users currentUserID={user._id} />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Dashboard;