import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtpLogin, verifyOtpLogin } from "./lib/api";

export default function OtpLoginPage() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      if (method === "email") {
        await sendOtpLogin({ email });
      } else {
        await sendOtpLogin({ phone });
      }
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await verifyOtpLogin({
        otp,
        email: method === "email" ? email : undefined,
        phone: method === "phone" ? phone : undefined,
      });

      if (!response.success) {
        throw new Error(response.message || "Invalid OTP");
      }

      // ✅ Lưu token + user
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.roles.includes("Admin")) {
        navigate("/admin");
      } else {
        const userId = response.data.user.userId;
        const onboardingKey = `onboarding_vehicle_skipped_${userId}`;
        const hasSkipped = localStorage.getItem(onboardingKey) === "true";
        if (!hasSkipped) {
          navigate("/vehicle-registration");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Login with OTP
        </h2>

        {step === "request" && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="flex gap-4 mb-4">
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
                <span>Phone</span>
              </label>
            </div>

            {method === "email" && (
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            )}

            {method === "phone" && (
              <input
                type="tel"
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

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
