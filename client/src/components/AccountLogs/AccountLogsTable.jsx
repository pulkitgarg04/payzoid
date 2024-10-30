import { useState } from 'react';

function AccountLogsTable({ logs }) {
    const [sortBy, setSortBy] = useState('date');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = logs.filter((transaction) => {
        if (filterType === 'all') return true;
        return transaction.transactionType.toLowerCase() === filterType;
    });

    const sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date);
        }
        return Math.abs(b.amount) - Math.abs(a.amount);
    });

    return (
        <div>
            <div className="flex flex-col justify-center">
                        <div className="flex justify-between mb-3 mx-20">
                            <div>
                                <label className="mr-2">Filter by Type:</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="border border-gray-300 rounded p-1 dark:bg-gray-700 dark:text-white dark:border-gray-800 dark:focus:border-gray-800"
                                >
                                    <option value="all">All</option>
                                    <option value="sent">Sent</option>
                                    <option value="received">Received</option>
                                </select>
                            </div>
                            <div>
                                <label className="mr-2">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded p-1 dark:bg-gray-700 dark:text-white dark:border-gray-800 dark:focus:border-gray-800"
                                >
                                    <option value="date">Date</option>
                                    <option value="amount">Amount</option>
                                </select>
                            </div>
                        </div>
                <div className="mx-10 bg-white shadow-lg rounded-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            {sortedTransactions.length > 0 ? (
                                <table className="table-auto w-full">
                                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                                        <tr>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Date & Time</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Activity Type</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Transaction ID</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Amount</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Balance After Transaction (If applicable)</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-600">
                                        
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
        </div>
    );
}

export default AccountLogsTable;