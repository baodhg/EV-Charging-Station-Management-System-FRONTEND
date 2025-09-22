import { useState } from "react";
import { FaCar, FaUsers, FaShieldAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

export default function Login() {
  const [role, setRole] = useState("driver");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-800">
        {/* Left: Role selection */}
        <div className="md:w-1/2 p-8 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              ⚡
            </div>
            <h1 className="text-2xl font-bold">EV Charging Management</h1>
          </div>
          <p className="text-gray-400 mb-6">Select your role and login to the system</p>

          <p className="text-sm font-semibold text-gray-300 mb-3">Select your role</p>

          <div className="space-y-4">
            <RoleCard
              icon={<FaCar />}
              title="EV Driver"
              desc="Manage charging sessions and payments"
              selected={role === "driver"}
              onClick={() => setRole("driver")}
            />
            <RoleCard
              icon={<FaUsers />}
              title="Charging Station Staff"
              desc="Operations and customer support"
              selected={role === "staff"}
              onClick={() => setRole("staff")}
            />
            <RoleCard
              icon={<FaShieldAlt />}
              title="System Administrator"
              desc="System-wide management and analytics"
              selected={role === "admin"}
              onClick={() => setRole("admin")}
            />
          </div>
        </div>

        {/* Right: Login form */}
        <div className="md:w-1/2 bg-gray-800 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
          <p className="text-sm text-gray-400 mb-6">Enter your login credentials</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg py-2 hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-2 text-gray-400 text-sm">OR CONTINUE WITH</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <SocialButton icon={<FcGoogle />} />
            <SocialButton icon={<FaFacebook className="text-blue-500" />} />
            <SocialButton icon={<FaApple className="text-gray-200" />} />
          </div>

          <p className="text-sm text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Sign up now
            </a>
          </p>
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
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer flex items-start space-x-3 border ${
        selected ? "border-blue-500 bg-gray-800/70" : "border-gray-700 bg-gray-800/30"
      } hover:border-blue-400 transition`}
    >
      <div className="text-xl text-blue-400">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
      <div className="ml-auto">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            selected ? "bg-blue-500 border-blue-500" : "border-gray-500"
          }`}
        />
      </div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition">
      {icon}
    </button>
  );
}
