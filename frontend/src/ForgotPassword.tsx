import { useState } from "react";

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage("✅ OTP đã được gửi về email.");
        setStep(2);
      } else {
        setMessage("❌ Không thể gửi OTP.");
      }
    } catch {
      setMessage("⚠️ Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (res.ok) {
        setMessage("✅ Đặt lại mật khẩu thành công. Hãy đăng nhập lại!");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        setMessage("❌ OTP không hợp lệ hoặc đã hết hạn.");
      }
    } catch {
      setMessage("⚠️ Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {step === 1 && (
          <>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mb-4 rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg py-2 hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm text-gray-300 mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mb-4 rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full mb-4 rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg py-2 hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </>
        )}

        {message && <p className="mt-4 text-center text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  );
}
