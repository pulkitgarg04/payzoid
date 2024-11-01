import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import { useAuthStore } from '../../store/authStore';
import Users from '../../components/Messages/Users';
import MessageBox from '../../components/Messages/MessageBox';

function Messages() {
    const { user } = useAuthStore();
    const name = `${user.firstName} ${user.lastName}`;

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <aside className="w-64 h-screen border-r border-gray-300">
                <Sidebar />
            </aside>

            <div className='flex-1 flex flex-col'>
                <Appbar name={name} />
                <div className="flex flex-1">
                    <div className="w-1/4 bg-white border-r border-gray-300">
                        <Users currentUserID={user._id} />
                    </div>
                    <div className="flex-1">
                        <MessageBox />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messages;
