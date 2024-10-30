import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function SendMoney() {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [recipient, setRecipient] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const name = `${user.firstName} ${user.lastName}`;

    useEffect(() => {
        const fetchRecipientDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getRecipentant/${id}`);
                const data = await response.json();

                console.log(data);

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch recipient details');
                }

                setRecipient(data.user);
            } catch (error) {
                toast.error(error.message || 'Error fetching recipient details');
            }
        };

        fetchRecipientDetails();
    }, [id]);

    const handleSubmit = async () => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        if (amount > user.balance) {
            toast.error('Insufficient balance.');
            return;
        }

        if (!recipient) {
            toast.error('Recipient not found.');
            return;
        }

        if (!recipient._id) {
            toast.error('Recipient ID is undefined.');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/transfer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    to: recipient._id,
                    note: note || '',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to transfer money');
            }

            const newBalance = user.balance - parseFloat(amount);
            useAuthStore.setState({ user: { ...user, balance: newBalance } });

            setAmount('');
            setNote('');
            toast.success('Transfer successful!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="flex dark:bg-gray-900">
            <aside className="w-64 h-screen">
                <Sidebar />
            </aside>

            <div className='flex-1'>
                <Appbar name={name} />

                <div className="font-manrope flex flex-col items-center justify-center">
                    <div className="font-bold text-2xl m-5 dark:text-gray-200">Send Money</div>
                    <div className="flex mx-auto box-border border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
                        <div className='w-1/2 m-5'>
                            <div className='flex justify-center items-center'>
                                <span className='text-4xl dark:text-gray-200'>&#8377;</span>
                                <input
                                    className="mt-1 ml-5 w-full text-3xl rounded-[4px] border border-[#A0ABBB] p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    type="number"
                                    placeholder="Enter the amount"
                                    value={amount}
                                    min="0"
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className='mt-3 text-center'>
                                <p className="text-gray-800 dark:text-gray-300">Total Balance: <span className='font-bold'>&#8377; {user.balance.toFixed(2)}</span></p>
                            </div>

                            <div className="mt-6">
                                <div className="font-semibold text-gray-800 dark:text-gray-300">Payment Method</div>
                                <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px] dark:bg-gray-700">
                                    <img className="h-8" src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Card" />
                                    <div className='pl-2'>
                                        <div className="font-semibold dark:text-gray-200">Debit Card</div>
                                        <div className="text-[#64748B]">7864 **** **** ****</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold mt-4 text-gray-800 dark:text-gray-300">Note</div>
                                <textarea
                                    className="w-full mt-2 p-3 rounded-[4px] border border-[#A0ABBB] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Add a note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='w-1/2 m-5 h-full'>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-gray-300">From</div>
                                <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px] dark:bg-gray-700">
                                    <div className="rounded-full flex justify-center items-center bg-slate-200 h-14 w-14 dark:bg-slate-600">
                                        <div className="dark:text-white"> {name[0]}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold dark:text-white">{name}</div>
                                        <div className="text-[#64748B] dark:text-gray-300">{user.email}</div>
                                        <div className="text-[#64748B] text-sm dark:text-gray-300">Banking Name: {name}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="font-semibold text-gray-800 dark:text-gray-300">To</div>
                                {recipient ? (
                                    <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px] dark:bg-gray-700">
                                        <div className="rounded-full flex justify-center items-center bg-slate-200 h-14 w-14 dark:bg-slate-600">
                                            <div className="dark:text-white">{recipient.firstName[0]}</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold dark:text-white">{recipient.firstName} {recipient.lastName}</div>
                                            <div className="text-[#64748B] dark:text-gray-300">{recipient.email}</div>
                                            <div className="text-[#64748B] dark:text-gray-300 text-sm">Banking Name: {recipient.firstName} {recipient.lastName}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">Loading recipient details...</div>
                                )}
                            </div>

                            <div
                                className="w-full cursor-pointer rounded-[4px] bg-gray-700 mt-8 px-3 py-[10px] text-center font-semibold text-white hover:bg-gray-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                onClick={handleSubmit}
                            >
                                Send Payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendMoney;