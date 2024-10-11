import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Appbar from '../../components/Appbar';
import { useUser } from '../../context/UserContext';

function SendMoney() {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('amitkumax@gmail.com');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const user = useUser();
    const name = user.name || "Pulkit Garg";

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${import.meta.env.BACKEND_URL}/api/v1/account/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    to: recipientEmail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to transfer money');
            }

            setSuccess('Transfer successful!');
        } catch (error) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <aside className="w-64 h-screen">
                <Sidebar />
            </aside>

            <div className='flex-1'>
                <Appbar name={name} />

                <div className="font-manrope flex flex-col items-center justify-center">
                    <div className="font-bold text-2xl m-5">Send money</div>
                    <div className="flex mx-auto box-border border bg-white p-4">
                        <div className='w-1/2 m-5'>
                            <div className='flex justify-center items-center'>
                                <span className='text-4xl'>&#8377;</span>
                                <input
                                    className="mt-1 ml-5 w-full text-3xl rounded-[4px] border border-[#A0ABBB] p-3"
                                    type="number"
                                    placeholder="Enter the amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className='mt-3 text-center'>
                                <p>Total Balance: <span className='font-bold'>&#8377; 5000.00</span></p>
                            </div>

                            <div className="mt-6">
                                <div className="font-semibold">Payment Method</div>
                                <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px]">
                                    <img className="h-8" src="mastercard.png" />
                                    <div>
                                        <div className="font-semibold">Debit Card</div>
                                        <div className="text-[#64748B]">7864 **** **** ****</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold mt-6">Note</div>
                                <textarea
                                    className="w-full mt-2 p-3 rounded-[4px] border border-[#A0ABBB]"
                                    placeholder="Add a note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='w-1/2 m-5 h-full'>
                            <div>
                                <div className="font-semibold">From</div>
                                <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px]">
                                    <img className="h-14 w-14 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s" />
                                    <div>
                                        <div className="font-semibold">{name}</div>
                                        <div className="text-[#64748B]">{user.email}</div>
                                        <div className="text-[#64748B] text-sm">Banking Name: {name}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="font-semibold">To</div>
                                <div className="flex items-center gap-x-[10px] bg-neutral-100 p-3 mt-2 rounded-[4px]">
                                    <img className="h-14 w-14 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&s" />
                                    <div>
                                        <div className="font-semibold">Amit Kumar</div>
                                        <div className="text-[#64748B]">{recipientEmail}</div>
                                        <div className="text-[#64748B] text-sm">Banking Name: Amit Kumar</div>
                                    </div>
                                </div>
                            </div>

                            <div 
                                className="w-full cursor-pointer rounded-[4px] bg-gray-700 mt-10 px-3 py-[10px] text-center font-semibold text-white"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Send Payment'}
                            </div>

                            {error && <div className="text-red-500 mt-2">{error}</div>}
                            {success && <div className="text-green-500 mt-2">{success}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendMoney;