import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { validateLogin, setCurrentUser } from "../utils/authStorage";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const user = validateLogin(username.trim(), password);
    if (user) {
      setCurrentUser(user);
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f7] via-[#e6ecf5] to-[#dfe6ef]">
      
      {/* Header */}
      <header className="w-full flex items-center justify-between px-4 sm:px-10 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/ads manager.png"
            alt="Google Ad Manager"
            className="h-8 w-auto object-contain"
          />
        </div>
        <button
          type="button"
          onClick={() => document.getElementById("login-form")?.scrollIntoView({ behavior: "smooth" })}
          className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </header>

      {/* Main */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10">

          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Admin Login
          </h1>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                 Email
              </label>
              <input
                type="text"
                placeholder="admin@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}