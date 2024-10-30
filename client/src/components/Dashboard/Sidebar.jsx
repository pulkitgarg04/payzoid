import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";
import { FaHome, FaInbox } from "react-icons/fa";
import { AiOutlineTransaction, AiOutlineMessage } from "react-icons/ai";
import { PiHandWithdrawFill } from "react-icons/pi";
import { IoIosNotificationsOutline, IoMdSettings, IoIosLogOut } from "react-icons/io";
import { TbLogs } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

const SidebarItem = ({ to, icon, children, onClick }) => (
    <li>
        {to ? (
            <Link
                to={to}
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-100 dark:hover:bg-indigo-700 text-gray-600 dark:text-gray-300 hover:text-indigo-800 dark:hover:text-white border-l-4 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400 pr-6"
            >
                <span className="inline-flex justify-center items-center ml-4">{icon}</span>
                <span className="ml-2 text-sm tracking-wide truncate">{children}</span>
            </Link>
        ) : (
            <div
                onClick={onClick}
                className="cursor-pointer relative flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-100 dark:hover:bg-indigo-700 text-gray-600 dark:text-gray-300 hover:text-indigo-800 dark:hover:text-white border-l-4 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400 pr-6"
            >
                <span className="inline-flex justify-center items-center ml-4">{icon}</span>
                <span className="ml-2 text-sm tracking-wide truncate">{children}</span>
            </div>
        )}
    </li>
);

const SidebarSection = ({ title }) => (
    <li className="px-5">
        <div className="flex flex-row items-center h-8">
            <div className="text-sm font-light tracking-wide text-gray-500 dark:text-gray-400">{title}</div>
        </div>
    </li>
);

function Sidebar() {
    const { logout } = useAuthStore();

    const handleLogout = () => {
        toast.promise(
            new Promise((resolve, reject) => {
                try {
                    logout();
                    resolve('Logout successful!');
                } catch (e) {
                    reject(new Error('Error logging out'));
                }
            }),
            {
                loading: 'Logging out...',
                success: 'You have been logged out!',
                error: 'Could not log out.',
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300">
            <div className="fixed top-0 left-0 w-64 bg-white dark:bg-gray-900 h-full border-r dark:border-gray-700">
                <div className="flex items-center justify-center h-14">
                    <h1 className="font-extrabold text-2xl">PAYZOID</h1>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <SidebarSection title="Dashboard" />
                        <SidebarItem to="/dashboard" icon={<FaHome />}>Home</SidebarItem>
                        <SidebarItem to="/dashboard/transactions" icon={<AiOutlineTransaction />}>Transactions</SidebarItem>
                        <SidebarItem icon={<PiHandWithdrawFill />}>
                            Withdraw / Deposit
                            <span className="px-2 py-0.5 ml-3 text-xs font-medium tracking-wide text-indigo-500 bg-red-50 dark:bg-gray-600 dark:text-white rounded-full">Soon</span>
                        </SidebarItem>
                        <SidebarItem icon={<FaInbox />}>
                            Inbox
                            <span className="px-2 py-0.5 ml-3 text-xs font-medium tracking-wide text-indigo-500 bg-red-50 dark:bg-gray-600 dark:text-white rounded-full">Soon</span>
                        </SidebarItem>
                        <SidebarItem icon={<AiOutlineMessage />}>
                            Messages
                            <span className="px-2 py-0.5 ml-5 text-xs font-medium tracking-wide text-indigo-500 bg-red-50 dark:bg-gray-600 dark:text-white rounded-full">Soon</span>
                        </SidebarItem>
                        <SidebarItem icon={<IoIosNotificationsOutline />}>
                            Notifications
                            <span className="px-2 py-0.5 ml-5 text-xs font-medium tracking-wide text-indigo-500 bg-red-50 dark:bg-gray-600 dark:text-white rounded-full">Soon</span>
                        </SidebarItem>
                        <SidebarItem to="/dashboard/account-logs" icon={<TbLogs />}>Account Logs</SidebarItem>

                        <SidebarSection title="Settings" />
                        <SidebarItem icon={<CgProfile />}>Profile</SidebarItem>
                        <SidebarItem icon={<IoMdSettings />}>Settings</SidebarItem>
                        <SidebarItem icon={<IoIosLogOut />} onClick={handleLogout}>Logout</SidebarItem>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;