import { useState } from "react";

function TransactionTable({ transactions }) {
    const [sortBy, setSortBy] = useState('date');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = transactions.filter((transaction) => {
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
                                                <div className="font-semibold text-center">Transaction ID</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Counterpart Name</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Counterpart Email</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Transaction Type</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Amount</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Balance</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-600">
                                        {sortedTransactions.map((transaction) => (
                                            <tr key={transaction._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{new Date(transaction.date).toLocaleString()}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{transaction.transactionId}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                                                            <div className="rounded-full flex justify-center items-center bg-slate-200 h-10 w-10 dark:bg-slate-700">
                                                                <div>{transaction.counterpartName[0]}</div>
                                                            </div>
                                                        </div>
                                                        <div className="font-medium text-gray-800 dark:text-gray-200">{transaction.counterpartName}</div>
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{transaction.counterpartEmail}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{transaction.transactionType}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className={`text-center font-medium ${transaction.transactionType === 'Sent' ? 'text-red-500' : 'text-green-500'}`}>
                                                        Rs. {Math.abs(transaction.amount).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center font-medium">Rs. {transaction.balance.toFixed(2)}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center text-gray-500 font-medium p-4 dark:text-gray-400">
                                    No transactions found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionTable;