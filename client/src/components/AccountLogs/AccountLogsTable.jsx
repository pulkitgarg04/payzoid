import { useState } from 'react';
import { MdOutlineDelete } from "react-icons/md";

function AccountLogsTable({ logs, setLogs }) {
    const [sortBy, setSortBy] = useState('date');
    const [filterType, setFilterType] = useState('all');

    const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

    const filteredLogs = logs.filter((log) => {
        if (filterType === 'all') return true;
        return log.activityType.toLowerCase() === filterType;
    });

    const sortedLogs = filteredLogs.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.timestamp) - new Date(a.timestamp);
        } else if (sortBy === 'old') {
            return new Date(a.timestamp) - new Date(b.timestamp);
        }
        return 0;
    });

    const handleRemoveLog = async (logId) => {
        try {
            const response = await fetch(`${API_URL}/deleteUserLog/${logId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setLogs(prevLogs => prevLogs.filter(log => log._id !== logId));
            } else {
                console.error('Error removing log:', response.status);
            }
        } catch (error) {
            console.error('Error removing log', error);
        }
    };

    return (
        <div className="flex flex-col justify-center">
            <div className="flex justify-between mb-3 mx-20">
                <div>
                    <label className="mr-2">Filter by Activity Type:</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded p-1 dark:bg-gray-700 dark:text-white dark:border-gray-800 dark:focus:border-gray-800"
                    >
                        <option value="all">All</option>
                        <option value="login">Login</option>
                        <option value="money transfer">Money Transfer</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2">Sort by Date:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded p-1 dark:bg-gray-700 dark:text-white dark:border-gray-800 dark:focus:border-gray-800"
                    >
                        <option value="date">Newest</option>
                        <option value="old">Oldest</option>
                    </select>
                </div>
            </div>
            <div className="mx-10 mb-10 bg-white shadow-lg rounded-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-3">
                    <div className="overflow-x-auto">
                        {sortedLogs.length > 0 ? (
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                                    <tr>
                                        <th className="p-2 whitespace-nowrap">Date & Time</th>
                                        <th className="p-2 whitespace-nowrap">Activity Type</th>
                                        <th className="p-2 whitespace-nowrap">Transaction Id (If Applicable)</th>
                                        <th className="p-2 whitespace-nowrap">Operating System</th>
                                        <th className="p-2 whitespace-nowrap">Browser</th>
                                        <th className="p-2 whitespace-nowrap">Device</th>
                                        <th className="p-2 whitespace-nowrap">Remove</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-600">
                                    {sortedLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td className="p-2 text-center">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="p-2 text-center">{log.activityType}</td>
                                            <td className="p-2 text-center">{log.transactionId || '-'}</td>
                                            <td className="p-2 text-center">{log.os || 'N/A'}</td>
                                            <td className="p-2 text-center">{log.browser || 'N/A'}</td>
                                            <td className="p-2 text-center">{log.device.charAt(0).toUpperCase() + log.device.slice(1) || 'N/A'}</td>
                                            {
                                                log.activityType !== 'Signup' ? (
                                                    <td className='p-2 flex justify-center cursor-pointer' onClick={() => handleRemoveLog(log._id)}>
                                                        <MdOutlineDelete className='w-5 h-5' />
                                                    </td>
                                                ) : null
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-500 font-medium p-4 dark:text-gray-400">
                                No Account Logs found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountLogsTable;