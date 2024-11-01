import { useState, useEffect } from 'react'
import axios from 'axios'

function User({ user }) {
    return (
        <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3">
                <img
                    className='rounded-full object-contain'
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`}
                    alt="avatar"
                />
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-semibold">{user.firstName + ' ' + user.lastName}</h2>
                <p className="text-gray-600">New Message</p>
            </div>
        </div>
    )
}

function Users({ currentUserID }) {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bulk?filter=${filter}`);
                const filteredUsers = response.data.user.filter(user => user._id !== currentUserID).sort((a, b) => a.firstName.localeCompare(b.firstName));
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
    }, [filter, currentUserID]);

    return (
        <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
            <input
                className="px-2 py-1 my-5 rounded outline-2 outline-gray-300 outline w-full dark:outline-gray-700 dark:bg-gray-800 dark:text-gray-300"
                type="text"
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search people to message..."
            />

            {users.map((user) => (
                <User key={user._id} user={user} />
            ))}
        </div>
    )
}

export default Users