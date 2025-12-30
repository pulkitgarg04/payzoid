import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Dashboard/Sidebar';
import Appbar from '../../components/Dashboard/Appbar';
import RecipientSkeleton from '../../components/Dashboard/RecipientSkeleton';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function SendMoney() {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRecipient, setIsLoadingRecipient] = useState(true);
    const [recipient, setRecipient] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const name = `${user.firstName} ${user.lastName}`;

    useEffect(() => {
        const fetchRecipientDetails = async () => {
            setIsLoadingRecipient(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getRecipentant/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch recipient details');
                }

                setRecipient(data.user);
            } catch (error) {
                toast.error(error.message || 'Error fetching recipient details');
                navigate('/dashboard');
            } finally {
                setIsLoadingRecipient(false);
            }
        };

        fetchRecipientDetails();
    }, [id, navigate]);

    const handleSubmit = async () => {
        if (isSubmitting || isLoadingRecipient) return;

        const loadingToastId = toast.loading('Processing transfer...');
        setIsSubmitting(true);

        if (!amount || amount <= 0) {
            toast.dismiss(loadingToastId);
            toast.error('Please enter a valid amount.');
            setIsSubmitting(false);
            return;
        }

        if (amount > user.balance) {
            toast.dismiss(loadingToastId);
            toast.error('Insufficient balance.');
            setIsSubmitting(false);
            return;
        }

        if (!recipient || !recipient.id) {
            toast.dismiss(loadingToastId);
            toast.error('Recipient not found.');
            setIsSubmitting(false);
            return;
        }

        const idempotencyKey = crypto.randomUUID();

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/account/transfer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Idempotency-Key': idempotencyKey,
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    to: recipient.id,
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
            toast.dismiss(loadingToastId);
            toast.success('Transfer successful!');

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
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
                                        <div>
                                            <img
                                                className='rounded-full'
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${name}`}
                                                alt="avatar"
                                            />
                                        </div>
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
                                {isLoadingRecipient ? (
                                    <RecipientSkeleton />
                                ) : recipient ? (
                                    <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px] dark:bg-gray-700">
                                        <div className="rounded-full flex justify-center items-center bg-slate-200 h-14 w-14 dark:bg-slate-600">
                                            <div>
                                                <img
                                                    className='rounded-full'
                                                    src={recipient.avatar || `https://ui-avatars.com/api/?name=${recipient.firstName}`}
                                                    alt="avatar"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-semibold dark:text-white">{recipient.firstName} {recipient.lastName}</div>
                                            <div className="text-[#64748B] dark:text-gray-300">{recipient.email}</div>
                                            <div className="text-[#64748B] dark:text-gray-300 text-sm">Banking Name: {recipient.firstName} {recipient.lastName}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400 p-3">
                                        Recipient not found
                                    </div>
                                )}
                            </div>

                            {
                                isSubmitting ? (
                                    <div className="w-full cursor-not-allowed rounded-[4px] bg-gray-700 mt-8 px-3 py-[10px] text-center font-semibold text-white dark:bg-indigo-600">
                                        Processing...
                                    </div>
                                ) : (
                                    <div
                                        className={`w-full rounded-[4px] mt-8 px-3 py-[10px] text-center font-semibold text-white ${
                                            isLoadingRecipient || !recipient
                                                ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                                                : 'bg-indigo-600 hover:bg-indigo-500 cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500'
                                        }`}
                                        onClick={isLoadingRecipient || !recipient ? undefined : handleSubmit}
                                    >
                                        Send Money
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendMoney;