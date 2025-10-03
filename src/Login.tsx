import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaFacebook } from "react-icons/fa";
import { login, socialLogin } from "./lib/api";
import { requestFacebookAccessToken } from "./lib/facebook";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID?.trim();

  const handleLoginSuccess = (data: Awaited<ReturnType<typeof login>>["data"]) => {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.roles.includes("Admin")) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({ email, password });

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      handleLoginSuccess(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await socialLogin({
        provider: "google",
        idToken: credential,
      });

      if (!response.success) {
        throw new Error(response.message || "Google sign-in failed");
      }

      handleLoginSuccess(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookSignIn = async () => {
    if (!facebookAppId) {
      setError("Facebook sign-in is not configured.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const authResponse = await requestFacebookAccessToken(facebookAppId);
      const response = await socialLogin({
        provider: "facebook",
        idToken: "",
        accessToken: authResponse.accessToken,
      });

      if (!response.success) {
        throw new Error(response.message || "Facebook sign-in failed");
      }

      handleLoginSuccess(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Facebook sign-in failed";
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

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-8">Please sign in to continue</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl py-3 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <div className="flex flex-col space-y-3 mb-6">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleSuccess(credentialResponse.credential);
              } else {
                setError("Google sign-in failed. Please try again.");
              }
            }}
            onError={() => setError("Google sign-in failed. Please try again.")}
          />

          <SocialButton
            icon={<FaFacebook className="text-blue-600" />}
            label="Continue with Facebook"
            onClick={handleFacebookSignIn}
            disabled={isSubmitting}
          />
        </div>

        <p className="text-sm text-gray-600 text-center">
          Don&apos;t have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up now</Link>
        </p>
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-2xl bg-gray-100 flex items-center justify-center gap-3 hover:bg-gray-200 transition border border-gray-300 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}



