import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./lib/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
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

      // 🔹 Lưu token + user
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data));

      // 🔹 Điều hướng sang dashboard
      navigate("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Register failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-blue-500 text-white text-3xl font-bold">
            ⚡
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Sign up to get started
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              placeholder="+84 123 456 789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
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
