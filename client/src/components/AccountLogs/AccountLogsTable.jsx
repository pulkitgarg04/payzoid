import { useState } from 'react';

function AccountLogsTable({ logs }) {
    const [sortBy, setSortBy] = useState('date');
    const [filterType, setFilterType] = useState('all');

    const filteredLogs = logs.filter((log) => {
        if (filterType === 'all') return true;
        return log.activityType.toLowerCase() === filterType;
    });

    const sortedLogs = filteredLogs.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
        return 0;
    });

    return (
        <div className="flex flex-col justify-center">
            <div className="mx-10 mb-10 bg-white shadow-lg rounded-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-3">
                    <div className="overflow-x-auto">
                        {sortedLogs.length > 0 ? (
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                                    <tr>
                                        <th className="p-2 whitespace-nowrap">Date & Time</th>
                                        <th className="p-2 whitespace-nowrap">Activity Type</th>
                                        <th className="p-2 whitespace-nowrap">Transaction Id</th>
                                        <th className="p-2 whitespace-nowrap">Operating System</th>
                                        <th className="p-2 whitespace-nowrap">Browser</th>
                                        <th className="p-2 whitespace-nowrap">Device</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-600">
                                    {sortedLogs.map((log, idx) => (
                                        <tr key={idx}>
                                            <td className="p-2 text-center">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="p-2 text-center">{log.activityType}</td>
                                            <td className="p-2 text-center">{log.transactionId || '-'}</td>
                                            <td className="p-2 text-center">{log.os || 'N/A'}</td>
                                            <td className="p-2 text-center">{log.browser || 'N/A'}</td>
                                            <td className="p-2 text-center">{log.device || 'N/A'}</td>
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