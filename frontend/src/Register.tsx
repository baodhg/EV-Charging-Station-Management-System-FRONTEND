import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerAccount } from "./lib/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerAccount({
        fullName: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (!response.success) {
        throw new Error(response.message || "Registration failed.");
      }

      setSuccess(response.message || "Registration successful.");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      console.info("Registration response", response.data);

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-indigo-950 px-4">
      {/* Background lightning */}
      <div className="absolute inset-0 bg-lightning"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-sm text-gray-300 mb-8">Sign up as <span className="text-cyan-300">EV Driver</span></p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full rounded-2xl bg-white/20 text-white px-4 py-3 shadow-inner focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300" required />
          <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" className="w-full rounded-2xl bg-white/20 text-white px-4 py-3 shadow-inner focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300" required />
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" className="w-full rounded-2xl bg-white/20 text-white px-4 py-3 shadow-inner focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300" required />
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm Password" className="w-full rounded-2xl bg-white/20 text-white px-4 py-3 shadow-inner focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300" required />

          {error ? (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-emerald-300" role="status">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl py-3 shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-300 text-center mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-cyan-400 hover:underline">Sign in</Link>
        </p>

        <div className="mt-4 text-center">
          <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-white transition">← Back to Login</button>
        </div>
      </div>
    </div>
  );
}
