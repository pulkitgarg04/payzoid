function TransactionTable() {
    return (
        <div>
                <div className="flex flex-col justify-center">
                    <div className="mx-10 bg-white shadow-lg rounded-sm border border-gray-200">
                        <div className="p-3">
                            <div className="overflow-x-auto">
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
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center">10th October 2024 - 10:48 PM</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center">1384MTD87T</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full" src="https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png" width="40" height="40" alt="Alex Shatov" /></div>
                                                    <div className="font-medium text-gray-800">Amit Kumar</div>
                                                </div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center">username@email.com</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center font-medium text-green-500">$2,890.66</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center font-medium">$12,890.66</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center">10th October 2024 - 10:48 PM</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center">1384MTD87T</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full" src="https://www.shareicon.net/data/512x512/2015/09/18/103160_man_512x512.png" width="40" height="40" alt="Alex Shatov" /></div>
                                                    <div className="font-medium text-gray-800">Mahesh Jindal</div>
                                                </div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center">username@email.com</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center font-medium text-green-500">$2,890.66</div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <div className="text-center font-medium">$12,890.66</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default TransactionTable;
