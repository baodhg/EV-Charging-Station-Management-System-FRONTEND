import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { FaApple, FaCar, FaFacebook, FaShieldAlt, FaUsers } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { login, pingAuth } from "./lib/api";

export default function Login() {
  const [role, setRole] = useState("driver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "error">("checking");

  useEffect(() => {
    let isActive = true;

    pingAuth()
      .then((response) => {
        if (!isActive) {
          return;
        }

        setBackendStatus(response.success ? "connected" : "error");
      })
      .catch(() => {
        if (isActive) {
          setBackendStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const connectionBanner =
    backendStatus === "connected"
      ? {
          text: "Backend connection OK",
          className: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
        }
      : backendStatus === "error"
      ? {
          text: "Cannot reach backend API. Check that it is running.",
          className: "bg-red-500/10 text-red-300 border border-red-500/40",
        }
      : {
          text: "Checking backend connection...",
          className: "bg-gray-700 text-gray-200 border border-gray-600",
        };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });

      if (!response.success) {
        throw new Error(response.message || "Login failed.");
      }

      setSuccess(response.message || "Login successful.");
      console.info("Login response", response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-800">
        <div className="md:w-1/2 p-8 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
              EV
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

        <div className="md:w-1/2 bg-gray-800 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
          <p className="text-sm text-gray-400 mb-6">Enter your login credentials</p>
          <div className={`mb-4 text-sm rounded-lg px-3 py-2 transition-colors ${connectionBanner.className}`}>
            {connectionBanner.text}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                required
                className="w-full rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                autoComplete="current-password"
                required
                className="w-full rounded-lg bg-gray-700 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="text-sm text-emerald-400" role="status">
                {success}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg py-2 hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
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

