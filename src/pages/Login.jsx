import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await login(username, password);
      if (data.access) localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      await setAuth(data.access, data.refresh);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a0a3e 0%, #2D1B69 40%, #3B1F8E 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-[#4DD9E8]" />
          <div className="absolute top-20 left-20 w-48 h-48 rounded-full border border-[#E91E8C]" />
          <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full border-2 border-[#FFD700]" />
          <div className="absolute bottom-40 right-32 w-24 h-24 rounded-full border border-[#4DD9E8]" />
          <div className="absolute top-1/3 right-20 w-16 h-16 rounded-full bg-[#E91E8C] opacity-20" />
          <div className="absolute bottom-1/3 left-16 w-20 h-20 rounded-full bg-[#4DD9E8] opacity-15" />
        </div>

        {/* Logo and tagline */}
        <div className="relative z-10 text-center px-12">
          <img
            src="/logo.png"
            alt="Twimbol"
            className="w-64 mx-auto mb-8 drop-shadow-lg"
          />
          <h2 className="text-white text-2xl font-light mb-3 tracking-wide">
            Safe Social Media for Kids
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
            A safe digital space for children promoting healthy content and responsible internet use.
          </p>
        </div>

        {/* Bottom decorative gradient line */}
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{
            background: "linear-gradient(90deg, #E91E8C, #4DD9E8, #FFD700)",
          }}
        />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#f8f7fc]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/logo.png" alt="Twimbol" className="w-40" />
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2D1B69] mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue to Twimbol
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-purple-100/50 p-8 border border-gray-100">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Username field */}
              <div>
                <label className="block text-xs font-semibold text-[#2D1B69] mb-2 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#f8f7fc] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#3B1F8E] focus:ring-2 focus:ring-[#3B1F8E]/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold text-[#2D1B69] mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 bg-[#f8f7fc] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#3B1F8E] focus:ring-2 focus:ring-[#3B1F8E]/10 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#E91E8C] hover:text-[#c4167a] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2D1B69 0%, #3B1F8E 50%, #5B2FC9 100%)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#3B1F8E] hover:text-[#2D1B69] transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-xs text-gray-400">
            Protected by Twimbol · Safe for Kids
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
