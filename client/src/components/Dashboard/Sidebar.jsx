import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { toast } from "react-hot-toast"

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
                success: <b>You have been logged out!</b>,
                error: <b>Could not log out.</b>,
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="fixed top-0 left-0 w-64 bg-white h-full border-r">
                <div className="flex items-center justify-center h-14">
                    <h1 className="font-extrabold text-2xl">PAYZOID</h1>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">Dashboard</div>
                            </div>
                        </li>
                        <li>
                            <Link to="/dashboard" href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Home</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/dashboard/transactions" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="#000000" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M56.5,49L56.5,49V1c0-0.6-0.4-1-1-1h-45c-0.6,0-1,0.4-1,1v14h2V2h43v46h-9c-0.6,0-1,0.4-1,1v9h-33V43h-2v16
			c0,0.6,0.4,1,1,1h35c0.3,0,0.5-0.1,0.7-0.3l10-10c0.1-0.1,0.1-0.2,0.2-0.3v-0.1C56.5,49.2,56.5,49.1,56.5,49z M46.5,50h6.6
			l-3.3,3.3l-3.3,3.3L46.5,50L46.5,50z"/>
                                        <path d="M16.5,38h6h4v-2h-3V17c0-0.6-0.4-1-1-1h-6c-0.6,0-1,0.4-1,1v6h-5c-0.6,0-1,0.4-1,1v4h-5c-0.6,0-1,0.4-1,1v8
			c0,0.6,0.4,1,1,1h6H16.5z M17.5,18h4v18h-4V24V18z M11.5,25h4v11h-4v-7V25z M5.5,30h4v6h-4V30z"/>
                                        <path d="M50.5,24V7c0-0.6-0.4-1-1-1h-21c-0.6,0-1,0.4-1,1v17c0,0.6,0.4,1,1,1h21C50.1,25,50.5,24.6,50.5,24z M48.5,12h-12V8h12V12
			z M34.5,8v4h-5c0-1.6,0-4,0-4H34.5z M29.5,14h5v9h-5C29.5,23,29.5,18.3,29.5,14z M36.5,23v-9h12v9H36.5z"/>
                                        <rect x="28.5" y="28" width="21" height="2" />
                                        <rect x="28.5" y="33" width="21" height="2" />
                                        <rect x="28.5" y="38" width="21" height="2" />
                                        <rect x="14.5" y="6" width="6" height="2" />
                                        <rect x="14.5" y="11" width="9" height="2" />
                                        <rect x="14.5" y="43" width="7" height="2" />
                                        <rect x="24.5" y="43" width="7" height="2" />
                                        <rect x="34.5" y="43" width="7" height="2" />
                                        <rect x="14.5" y="48" width="7" height="2" />
                                        <rect x="24.5" y="48" width="7" height="2" />
                                        <rect x="34.5" y="48" width="7" height="2" />
                                        <rect x="14.5" y="53" width="7" height="2" />
                                        <rect x="24.5" y="53" width="7" height="2" />
                                        <rect x="34.5" y="53" width="7" height="2" />
                                    </svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Transactions</span>
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Inbox</span>
                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-red-50 rounded-full">Soon</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Messages</span>
                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-red-50 rounded-full">Soon</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-red-50 rounded-full">Soon</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 297 297">
                                        <path d="M83.738,161.302c-15.467,0-28.051,12.583-28.051,28.051c0,15.468,12.583,28.05,28.051,28.05
				c15.468,0,28.05-12.583,28.05-28.05C111.788,173.886,99.205,161.302,83.738,161.302z M83.738,197.336
				c-4.402,0-7.983-3.581-7.983-7.983c0-4.402,3.581-7.983,7.983-7.983c4.402,0,7.983,3.581,7.983,7.983
				C91.721,193.754,88.14,197.336,83.738,197.336z"/>
                                        <path d="M148.5,161.302c-15.467,0-28.05,12.583-28.05,28.051c0,15.468,12.583,28.05,28.05,28.05
				c15.467,0,28.051-12.583,28.051-28.05C176.551,173.886,163.967,161.302,148.5,161.302z M148.5,197.336
				c-4.402,0-7.983-3.581-7.983-7.983c0-4.402,3.581-7.983,7.983-7.983c4.402,0,7.983,3.581,7.983,7.983
				C156.483,193.754,152.902,197.336,148.5,197.336z"/>
                                        <path d="M213.262,161.302c-15.467,0-28.05,12.583-28.05,28.051c0,15.468,12.583,28.05,28.05,28.05
				c15.467,0,28.05-12.583,28.05-28.05C241.312,173.886,228.729,161.302,213.262,161.302z M213.262,197.336
				c-4.402,0-7.983-3.581-7.983-7.983c0-4.402,3.581-7.983,7.983-7.983c4.402,0,7.983,3.581,7.983,7.983
				C221.245,193.754,217.664,197.336,213.262,197.336z"/>
                                        <path d="M225.426,103.515c-1.396,0-2.798,0.042-4.2,0.125c-9.851-31.388-39.067-53.304-72.726-53.304
				S85.624,72.253,75.774,103.64c-1.401-0.083-2.803-0.125-4.2-0.125C32.108,103.515,0,135.623,0,175.089
				c0,39.467,32.108,71.575,71.574,71.575h153.852c39.466,0,71.574-32.108,71.574-71.575
				C297,135.623,264.892,103.515,225.426,103.515z M225.426,226.596H71.574c-28.4,0-51.506-23.106-51.506-51.507
				c0-28.4,23.106-51.506,51.506-51.506c3.279,0,6.6,0.323,9.873,0.959c2.633,0.515,5.362-0.051,7.578-1.565
				c2.214-1.514,3.731-3.852,4.21-6.492c4.848-26.701,28.091-46.082,55.264-46.082c27.173,0,50.416,19.381,55.264,46.082
				c0.479,2.64,1.996,4.978,4.21,6.492c2.215,1.514,4.946,2.08,7.578,1.565c3.273-0.636,6.594-0.959,9.873-0.959
				c28.4,0,51.506,23.106,51.506,51.506C276.932,203.49,253.826,226.596,225.426,226.596z"/>
                                    </svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Account Logs</span>
                            </a>
                        </li>
                        <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                                <div className="text-sm font-light tracking-wide text-gray-500">Settings</div>
                            </div>
                        </li>
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Settings</span>
                            </a>
                        </li>
                        <li>
                            <div onClick={handleLogout} className="cursor-pointer relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                                <span className="inline-flex justify-center items-center ml-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </span>
                                <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar