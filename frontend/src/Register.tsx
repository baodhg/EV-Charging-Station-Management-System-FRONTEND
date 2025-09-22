import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Đăng ký thành công cho ${form.name} (${form.email})`);
    navigate("/");
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

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl py-3 shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition">Sign Up</button>
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
