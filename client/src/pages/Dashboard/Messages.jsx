import { useState } from 'react';
import Sidebar from '../../components/Dashboard/Sidebar';
import { useAuthStore } from '../../store/authStore';
import Users from '../../components/Messages/Users';
import MessageBox from '../../components/Messages/MessageBox';

function Messages() {
    const { user } = useAuthStore();
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <aside className="w-64 h-screen border-r border-gray-300">
                <Sidebar />
            </aside>

            <div className='flex-1 flex-col'>
                <div className="flex flex-1 ">
                    <div className="w-1/4 bg-white border-r border-gray-300 dark:bg-gray-900">
                        <Users currentUserID={user._id} setSelectedUser={setSelectedUser} />
                    </div>
                    <div className="flex-1">
                        {
                            selectedUser ? (
                                <MessageBox selectedUser={selectedUser} currentUserID={user._id} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Select a user to start chatting
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messages;
