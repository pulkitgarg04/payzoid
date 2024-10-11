import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import Appbar from '../../components/Appbar';
import Balance from '../../components/Balance';
import Transactions from '../../components/TransactionTable';
import { useUser } from '../../context/UserContext';

const Dashboard = () => {
  const name = "Pulkit Garg";
  const balance = 34614366.1514143;
  return (
    <div className="flex">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={name} />
        <div>
          <Balance balance={balance} />

          <h2 className='m-8 text-2xl font-bold'>Recent Transactions</h2>
          <Transactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
