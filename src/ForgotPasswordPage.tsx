import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "./lib/api"; // gọi API từ api.ts

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      setLoading(true);

      if (method === "email") {
        await forgotPassword({ email });
        setMessage("✅ OTP has been sent to your email.");
      } else {
        // Nếu backend hỗ trợ API gửi OTP qua phone thì thay bằng API thật
        // ví dụ: await forgotPasswordByPhone({ phone });
        setMessage("✅ OTP has been sent to your phone.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "❌ Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Choose a recovery method and enter your details
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Chọn phương thức */}
          <div className="flex gap-6 mb-4 justify-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={method === "email"}
                onChange={() => setMethod("email")}
              />
              <span>Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={method === "phone"}
                onChange={() => setMethod("phone")}
              />
              <span>Phone (OTP)</span>
            </label>
          </div>

          {/* Input theo lựa chọn */}
          {method === "email" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {method === "phone" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g., 0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Messages */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {/* Back button */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full py-2 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
