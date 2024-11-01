import { useState } from 'react';

function Message({ isSender, text, avatarSrc }) {
    return (
        <div className={`flex mb-4 cursor-pointer ${isSender ? 'justify-end' : ''}`}>
            {!isSender && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img src={avatarSrc} alt="User Avatar" className="w-8 h-8 rounded-full" />
                </div>
            )}
            <div className={`flex max-w-96 ${isSender ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'} rounded-lg p-3 gap-3`}>
                <p>{text}</p>
            </div>
            {isSender && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                    <img src={avatarSrc} alt="My Avatar" className="w-8 h-8 rounded-full" />
                </div>
            )}
        </div>
    );
}


function MessageBox() {
    const [messages, setMessages] = useState([
        { isSender: false, text: "Hey Pulkit, how's it going?", avatarSrc: 'https://avatar.iran.liara.run/public/girl' },
        { isSender: true, text: "Hi Aditi! I'm good. How about you?", avatarSrc: 'https://avatar.iran.liara.run/public/boy' },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages((prev) => [
                ...prev,
                { isSender: true, text: newMessage, avatarSrc: 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' }
            ]);
            setNewMessage(""); // Clear input after sending
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="bg-white p-4 text-gray-700">
                <h1 className="text-2xl font-semibold">Aditi Sharma</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-16">
                {messages.map((msg, index) => (
                    <Message key={index} isSender={msg.isSender} text={msg.text} avatarSrc={msg.avatarSrc} />
                ))}
            </div>

            <footer className="bg-white border-t border-gray-300 p-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
                    >
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default MessageBox;