import { useState, useEffect } from 'react'
import axios from 'axios'

function User({ user, onClick }) {
    return (
        <div onClick={() => onClick(user)} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md dark:hover:bg-gray-800">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3">
                <img
                    className='rounded-full object-contain'
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`}
                    alt="avatar"
                />
            </div>
            <div className="flex-1">
                <h2 className="text-md font-semibold">{user.firstName + ' ' + user.lastName}</h2>
                <p className="text-sm text-gray-60 dark:text-gray-300">New Message</p>
            </div>
        </div>
    )
}

function Users({ currentUserID, setSelectedUser }) {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bulk?filter=${filter}`);
                const filteredUsers = response.data.user.filter(user => user.id !== currentUserID).sort((a, b) => a.firstName.localeCompare(b.firstName));
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
    }, [filter, currentUserID]);

    return (
        <div className="overflow-y-auto max-h-[calc(100vh-40px)]
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 p-3 mb-9 pb-2 dark:bg-gray-900">
            <input
                className="px-2 py-1 my-5 rounded outline-2 outline-gray-300 outline w-full dark:outline-gray-700 dark:bg-gray-800 dark:text-gray-300"
                type="text"
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search people to message..."
            />

            {users.map((user) => (
                <User key={user.id} user={user} onClick={setSelectedUser} />
            ))}
        </div>
    )
}

export default Users