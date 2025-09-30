import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import Dashboard from "./Dashboard";
import Reservations from "./Reservations";
import History from "./History";
import Profile from "./Profile";
import Wallet from "./Wallet";
import Login from "./Login";
import Register from "./Register";

// 🔹 Component bảo vệ route
function PrivateRoute({ element }: { element: ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/reservations" element={<PrivateRoute element={<Reservations />} />} />
        <Route path="/history" element={<PrivateRoute element={<History />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />

        {/* Fallback 404 */}
        <Route
          path="*"
          element={<div className="p-10 text-center text-xl">404 - Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
