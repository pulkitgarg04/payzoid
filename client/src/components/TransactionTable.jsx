function TransactionTable({ transactions }) {
    return (
        <div>
            <div className="flex flex-col justify-center">
                <div className="mx-10 bg-white shadow-lg rounded-sm border border-gray-200">
                    <div className="p-3">
                        <div className="overflow-x-auto">
                            {transactions.length > 0 ? (
                                <table className="table-auto w-full">
                                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                        <tr>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Date & Time</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Transaction Id</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Name</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Email</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Transaction</div>
                                            </th>
                                            <th className="p-2 whitespace-nowrap">
                                                <div className="font-semibold text-center">Balance</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100">
                                        {transactions.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{new Date(transaction.date).toLocaleString()}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{transaction.transactionId}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                                                            <div className="rounded-full flex justify-center items-center bg-slate-200 h-10 w-10">
                                                                <div>{transaction.recipientName[0]}</div>
                                                            </div>
                                                        </div>
                                                        <div className="font-medium text-gray-800">{transaction.recipientName}</div>
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center">{transaction.recipientEmail}</div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className={`text-center font-medium ${transaction.transaction > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        ${Math.abs(transaction.transaction).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <div className="text-center font-medium">${transaction.balance.toFixed(2)}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center text-gray-500 font-medium p-4">
                                    No transactions found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionTable;