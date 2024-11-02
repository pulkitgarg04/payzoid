import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import { useAuthStore } from "./store/authStore.js";
import Loading from "./components/Loading.jsx";
import Messages from "./pages/Dashboard/Messages.jsx";
import RequestMoney from "./pages/Dashboard/RequestMoney.jsx";

const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Login = lazy(() => import("./pages/Auth/Login"));
const EmailVerificationPage = lazy(() => import("./pages/Auth/EmailVerificationPage"));
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const Dashboard = lazy(() => import("./pages/Dashboard/Home"));
const Profile = lazy(() => import("./pages/Dashboard/Profile"));
const SendMoney = lazy(() => import("./pages/Dashboard/SendMoney"));
const Transactions = lazy(() => import("./pages/Dashboard/Transactions"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const AccountLogs = lazy(() => import("./pages/Dashboard/AccountLogs"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/dashboard/send/:id" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/dashboard/request/:id" element={<ProtectedRoute><RequestMoney /></ProtectedRoute>} />
          <Route path="/dashboard/message" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/dashboard/account-logs" element={<ProtectedRoute><AccountLogs /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;