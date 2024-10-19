import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Header from "../../components/Header";
import { useAuthStore } from "../../store/authStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuthStore();

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordShown((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);

      if (isAuthenticated && user?.isVerified) {
        toast.success('Login successful!');
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else if (isAuthenticated && !user?.isVerified) {
        toast('Please verify your email!', {
          icon: '⚠️',
        });
        setTimeout(() => {
          navigate("/verify-email");
        }, 2000);
      }
    } catch(error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  }

return (
  <div className="bg-white dark:bg-gray-900 min-h-screen">
    <Header />

    <div className="sm:mx-auto sm:w-full sm:max-w-sm pt-8">
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
        Login to your account
      </h2>
    </div>

    <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleLogin} className="space-y-6">

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type={passwordShown ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:placeholder-gray-500"
            />

            <div className="flex mt-4">
              <input
                id="password-checkbox"
                type="checkbox"
                checked={passwordShown}
                onChange={togglePasswordVisibility}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="password-checkbox" className="text-sm text-gray-500 ms-2 dark:text-neutral-400">
                Show password
              </label>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Sign in
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link to="/signup">
          <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Create account now
          </span>
        </Link>
      </p>
    </div>

    <Toaster />
  </div>
);
}

export default Login;