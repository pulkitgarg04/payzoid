import { useState, useEffect } from 'react';
import ThemeToggle from '../../components/ThemeToggle';
import { Link } from 'react-router-dom';

function Message({ isSender, text, avatarSrc }) {
    return (
        <div className={`flex mb-4 cursor-pointer ${isSender ? 'justify-end' : ''}`}>
            {!isSender && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <img src={avatarSrc} alt="User Avatar" className="w-8 h-8 rounded-full" />
                </div>
            )}
            <div className={`flex max-w-96 ${isSender ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'} rounded-lg p-3 gap-3`}>
                <p>{text}</p>
            </div>
            {isSender && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center ml-2">
                    <img src={avatarSrc} alt="My Avatar" className="w-8 h-8 rounded-full" />
                </div>
            )}
        </div>
    );
}

function MessageBox({ selectedUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedUser) {
            if (!selectedUser.avatar) selectedUser.avatar = 'https://avatar.iran.liara.run/public';
            setMessages([
                { isSender: false, text: "Hey, how's it going?", avatarSrc: selectedUser.avatar },
                { isSender: true, text: "Hi! I'm good. How about you?", avatarSrc: 'https://avatar.iran.liara.run/public/boy' }
            ]);
        }
    }, [selectedUser]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages((prev) => [
                ...prev,
                { isSender: true, text: newMessage, avatarSrc: 'https://avatar.iran.liara.run/public/boy' }
            ]);
            setNewMessage("");
        }
    };

    if (!selectedUser) return null;

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-800 p-4 text-gray-700 dark:text-gray-200 flex justify-between">
                <div className='flex justify-center items-center'>
                    <img className="w-9 h-9 rounded-full self-center" src={selectedUser.avatar} alt="avatar" />
                    <h1 className="ml-5 text-2xl font-semibold">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h1>
                </div>
                <ThemeToggle />
            </header>

            <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-140px)] dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                {messages.map((msg, index) => (
                    <Message key={index} isSender={msg.isSender} text={msg.text} avatarSrc={msg.avatarSrc} />
                ))}
            </div>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 p-4">
                <div className="flex items-center">
                    <Link to={`/dashboard/request/${selectedUser._id}`}>
                    <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md">
                        Request
                    </button>
                    </Link>
                    <Link to={`/dashboard/send/${selectedUser._id}`}>
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">
                            Pay
                        </button>
                    </Link>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full ml-2 p-2 rounded-md border border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        />
                    <button onClick={handleSendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default MessageBox;