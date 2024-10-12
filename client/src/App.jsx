import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Home";
import Profile from "./pages/Dashboard/Profile";
import SendMoney from "./pages/Dashboard/SendMoney.jsx";
import Transactions from "./pages/Dashboard/Transactions";
import { UserProvider } from "./context/UserContext.jsx";

function App() {
  return (
    <div>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/send/:id" element={<SendMoney />} />
            <Route path="/logout" element={<SendMoney />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  )
}

export default App;