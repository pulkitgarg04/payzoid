import Sidebar from '../components/Sidebar';
import Appbar from '../components/Appbar';
import Balance from '../components/Balance';
import Transactions from '../components/TransactionTable';

const Dashboard = () => {
  return (
    <div className="flex">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar />
        <div>
          <Balance />

          <h2 className='m-8 text-2xl font-bold'>Recent Transactions</h2>
          <Transactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
