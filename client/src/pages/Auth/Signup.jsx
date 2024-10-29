import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [passwordShown, setPasswordShown] = useState(false);

  const navigate = useNavigate();
  const { error, signup, isAuthenticated, isLoading } = useAuthStore();

  const togglePasswordVisibility = () => {
    setPasswordShown((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.email, formData.password, formData.firstName, formData.lastName);

      if (isAuthenticated) {
        toast.success('Signed up successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.warn('Please verify your email.');
        navigate('/verify-email');
      }
    } catch {
      toast.error(error || "Signup failed. Please try again.");
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
            value={formData.firstName}
            onChange={handleInputChange}
          />

          <Input
            id="lastName"
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange}
          />

          <Input
            id="email"
            label="Email address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <div>
            <Input
              id="password"
              label="Password"
              type={passwordShown ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
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