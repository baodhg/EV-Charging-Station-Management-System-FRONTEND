import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

// 🔹 Import các page
import Dashboard from "./Dashboard";
import Reservations from "./Reservations";
import History from "./History";
import Profile from "./Profile";
import Wallet from "./Wallet";
import Login from "./Login";
import Register from "./Register";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ProfileEditPage from "./ProfileEditPage";
import ChangePasswordPage from "./ChangePasswordPage";
import AdminDashboard from "./AdminDashboard";

// 🔹 Route bảo vệ cho user
function PrivateRoute({ element }: { element: ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
}

// 🔹 Route bảo vệ riêng cho admin
function AdminRoute({ element }: { element: ReactNode }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) return <Navigate to="/login" replace />;

  try {
    const parsed = JSON.parse(user);
    return parsed.roles?.includes("Admin")
      ? element
      : <Navigate to="/dashboard" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ðŸ”¹ Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ðŸ”¹ Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* ðŸ”¹ User routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/reservations" element={<PrivateRoute element={<Reservations />} />} />
        <Route path="/history" element={<PrivateRoute element={<History />} />} />
        <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />

        {/* ðŸ”¹ Profile + Edit + Change Password */}
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/profile/edit" element={<PrivateRoute element={<ProfileEditPage />} />} />
        <Route path="/profile/change-password" element={<PrivateRoute element={<ChangePasswordPage />} />} />

        {/* ðŸ”¹ Admin routes */}
        <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />

        {/* ðŸ”¹ 404 fallback */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-xl text-red-600 font-semibold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;



