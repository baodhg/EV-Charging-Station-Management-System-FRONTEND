import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { FaCar, FaUsers, FaShieldAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import Register from "./Register";

function Login() {
  const [role, setRole] = useState<"driver" | "staff" | "admin">("driver");

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-indigo-950">
      {/* Background mixed color (static, không animation) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl"></div>

      {/* Glassmorphism card */}
      <div className="relative z-10 max-w-5xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        {/* Left: Logo + role selection */}
        <div className="md:w-1/2 p-10 text-white">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.7)] bg-black/30 border border-cyan-400">
              ⚡
            </div>
            <h1 className="text-3xl font-bold tracking-wide neon-border">
              EV Management
            </h1>
          </div>
          <p className="text-gray-300 mb-2 text-sm uppercase tracking-wider">
            Choose role
          </p>

          <div className="space-y-4">
            <RoleCard
              icon={<FaCar />}
              title="EV Driver"
              desc="Manage charging sessions"
              selected={role === "driver"}
              onClick={() => setRole("driver")}
            />
            <RoleCard
              icon={<FaUsers />}
              title="Charging Station Staff"
              desc="Operations and support"
              selected={role === "staff"}
              onClick={() => setRole("staff")}
            />
            <RoleCard
              icon={<FaShieldAlt />}
              title="System Administrator"
              desc="System-wide management"
              selected={role === "admin"}
              onClick={() => setRole("admin")}
            />
          </div>
        </div>

        {/* Right: Login form */}
        <div className="md:w-1/2 bg-white/5 backdrop-blur-xl p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
          <p className="text-sm text-gray-300 mb-8">
            Welcome back! Please login.
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-2xl bg-white/20 text-white px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl bg-white/20 text-white px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl py-3 shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow h-px bg-gray-600" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-600" />
          </div>

          <div className="flex justify-center space-x-5 mb-6">
            <SocialButton icon={<FcGoogle />} />
            <SocialButton icon={<FaFacebook className="text-blue-500" />} />
            <SocialButton icon={<FaApple className="text-gray-200" />} />
          </div>

          {role === "driver" && (
            <p className="text-sm text-gray-300 text-center">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-cyan-400 hover:underline">
                Sign up now
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full p-4 rounded-2xl cursor-pointer flex items-center justify-between border transition
        ${
          selected
            ? "border-cyan-400/60 bg-white/10"
            : "border-white/15 bg-white/5 hover:bg-white/10"
        }`}
    >
      <div className="flex items-start space-x-3 text-left">
        <div className="text-xl text-cyan-300">{icon}</div>
        <div className="text-white">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-300">{desc}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            selected
              ? "bg-cyan-500 border-cyan-500 shadow-[0_0_0_3px] shadow-cyan-500/20"
              : "border-gray-400/60"
          }`}
        />
      </div>
    </button>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition border border-white/20"
    >
      {icon}
    </button>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
