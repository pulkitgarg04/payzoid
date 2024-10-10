import Sidebar from '../components/Sidebar';
import Appbar from '../components/Appbar';
import TransactionTable from '../components/TransactionTable';

const Dashboard = () => {
  return (
    <div className="flex">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar />
        <h2 className='text-2xl font-bold m-8'>Transactions</h2>
        <TransactionTable />
      </div>
    </div>
  );
};

export default Dashboard;