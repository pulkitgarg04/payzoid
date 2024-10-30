import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ButtonComponent({ text, onClick }) {
  return (
    <button
      className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded dark:bg-gray-700 dark:hover:bg-gray-600"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center font-medium bg-white dark:bg-gray-900">
      <div className="flex items-center mt-6">
        <div className="rounded-full flex justify-center items-center cursor-pointer bg-slate-200 dark:bg-slate-600 h-11 w-11">
          <div className="dark:text-white">{user.firstName[0]}</div>
        </div>
        <div>
          <div className="pl-4 text-lg text-gray-800 dark:text-gray-300">
            {user.firstName} {user.lastName}
          </div>
          <div className="pl-4 text-sm font-light text-gray-600 dark:text-gray-400">
            {user.email}
          </div>
        </div>
      </div>

      <div className="w-40 flex justify-center items-center text-sm">
        <ButtonComponent
          onClick={() => {
            navigate("/dashboard/send/" + user._id);
          }}
          text={"Send Money"}
        />
      </div>
    </div>
  );
}

function Users({ currentUserID }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/bulk?filter=${filter}`);
        const filteredUsers = response.data.user.filter(user => user._id !== currentUserID);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [filter, currentUserID]);

  return (
    <div className="px-10">
      <input
        className="px-2 py-1 rounded outline-2 outline-gray-300 outline w-full dark:outline-gray-700 dark:bg-gray-800 dark:text-gray-300"
        type="text"
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search people..."
      />
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Users;