import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Header from "../../components/Home/Header";
import { useAuthStore } from "../../store/authStore";

function Input({ id, label, type = "text", value, onChange, required = true, ...props }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:placeholder-gray-500"
          {...props}
        />
      </div>
    </div>
  );
}

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const navigate = useNavigate();
  const { error, signup, isLoading } = useAuthStore();

  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(email, password, firstName, lastName);

      if (result) {
        toast.success('Signed up successfully! Please verify your email.');
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      }
    } catch (error) {
      console.log("Error during signup:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-7 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Create New Account
        </h2>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="firstName"
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            id="lastName"
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <Input
              id="password"
              label="Password"
              type={passwordShown ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex mt-4">
              <input
                id="toggle-password-checkbox"
                type="checkbox"
                checked={passwordShown}
                onChange={togglePasswordVisibility}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="toggle-password-checkbox" className="text-sm text-gray-500 ms-2 dark:text-neutral-400">
                Show password
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {isLoading ? "Signing up..." : "Signup"}
            </button>
          </div>
        </form>

        <p className="m-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login">
            <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;