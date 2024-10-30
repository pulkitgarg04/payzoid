import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import Balance from '../../components/Dashboard/Balance';
import Users from '../../components/Dashboard/Users';
import { useAuthStore } from '../../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 h-screen">
        <Sidebar />
      </aside>

      <div className='flex-1'>
        <Appbar name={name} />
        <div>
          <Balance balance={user.balance} name={name} />
        </div>
        <div className='my-10'>
          <h2 className='m-8 text-2xl font-bold text-gray-800 dark:text-gray-200'>People</h2>
          <Users currentUserID={user._id} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;