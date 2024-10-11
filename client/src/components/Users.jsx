import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ButtonComponent({ text, onClick }) {
  return (
    <button
      className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center font-medium">
      <div className="flex items-center mt-6">
        <div className="rounded-full flex justify-center items-center cursor-pointer bg-slate-200 h-11 w-11">
          <div className=""> {user.firstName[0]}</div>
        </div>
        <div>
          <div className="pl-4 text-lg">
            {user.firstName} {user.lastName}
          </div>
          <div className="pl-4 text-sm font-light">
            {user.email}
          </div>
        </div>
      </div>

      <div className="w-40 flex justify-center items-center text-sm">
        <ButtonComponent
          onClick={() => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName);
          }}
          text={"Send Money"}
        />
      </div>
    </div>
  );
}


function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/user/bulk?filter=" + filter)
      .then((response) => {
        setUsers(response.data.user);
      });
  }, [filter]);

  return (
    <div className="px-10">
      <input
        className="px-2 py-1 rounded outline-2 outline-gray-300 outline w-full"
        type="text"
        onChange={(e) => {
          setFilter(e.target.value);
        }}
        placeholder="Search people..."
      />
      <div>
        {users.map((user) => (
          <User user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;