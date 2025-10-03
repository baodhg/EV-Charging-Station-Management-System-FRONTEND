import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  register,
  verifyRegisterOtp,
  type RegistrationChallenge,
} from "./lib/api";

const REDIRECT_DELAY_MS = 1500;

export default function Register() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [challenge, setChallenge] = useState<RegistrationChallenge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const resetOtpState = () => {
    setChallenge(null);
    setOtp("");
    setSuccess(null);
    setError(null);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(value && value !== password ? "Passwords do not match." : null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({
        fullName,
        email,
        password,
        phoneNumber: phone,
      });

      if (!response.success) {
        throw new Error(response.message || "Register failed");
      }

      setChallenge(response.data);
      setStep("otp");
      setOtp("");
      setSuccess("An OTP has been sent to your email. Please enter it to complete registration.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Register failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!challenge) {
      setError("Registration session has expired. Please start again.");
      setStep("form");
      resetOtpState();
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyRegisterOtp({
        userId: challenge.userId,
        otpCode: otp.trim(),
      });

      if (!response.success) {
        throw new Error(response.message || "Invalid OTP");
      }

      setSuccess("Registration completed! Redirecting you to the login page...");
      setTimeout(() => navigate("/login"), REDIRECT_DELAY_MS);
    } catch (err) {
      const message = err instanceof Error ? err.message : "OTP verification failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-blue-500 text-white text-3xl font-bold">
            EV
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          {step === "form" ? "Create Account" : "Verify Email"}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {step === "form"
            ? "Sign up to get started"
            : `Enter the OTP sent to ${challenge?.email ?? "your email"}`}
        </p>

        {success && <p className="text-sm text-green-600 mb-4 text-center">{success}</p>}
        {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

        {step === "form" ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => handleConfirmPasswordChange(event.target.value)}
                className={`w-full rounded-2xl border px-4 py-3 focus:ring-2 ${
                  confirmPasswordError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
              {confirmPasswordError && (
                <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                placeholder="+84 123 456 789"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
              <input
                type="text"
                placeholder="Enter the 6-digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                resetOtpState();
              }}
              className="w-full text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
