import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { addUser } from "../utils/authStorage";

export default function DomainUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Admin");
  const [domains, setDomains] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!username.trim()) {
      setMessage({ type: "error", text: "Email is required." });
      return;
    }
    if (!password || password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    const domainsList = domains
      .split(/\n/)
      .map((d) => d.trim())
      .filter(Boolean);
    const result = addUser({ username: username.trim(), password, role, domains: domainsList });
    if (result.ok) {
      setMessage({
        type: "success",
        text: "User created. They can log in and will only see data for their assigned domains.",
      });
      setUsername("");
      setPassword("");
      setDomains("");
    } else {
      setMessage({ type: "error", text: result.message || "Failed to create user." });
    }
  };

  return (
    <div className="bg-[#f4f6fb] min-h-screen px-4 py-6 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Domain User</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manages assigned domain resources with limited user-level permissions
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-800">
              Add New User with Domain Access
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter email"
                autoComplete="off"
                className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-full pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Admin">Admin</option>
                <option value="Publisher">Publisher</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Domains (one per line – user will only see data for these)
              </label>
              <textarea
                rows={3}
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                placeholder="e.g. Finrezo.com&#10;Fmrxm.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                One domain per line. Add multiple lines to let this user see data from all of them (e.g. both Finrezo.com and Fmrxm.com). Leave empty for no restriction (admin-like).
              </p>
            </div>

            {message.text && (
              <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.text}
              </p>
            )}

            <div className="pt-4 pb-2 flex justify-center">
              <button
                type="submit"
                className="px-8 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-900">
            Instructions:
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            This page allows you to create new users with specific domain access permissions.
          </p>

          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-start">
              <div className="mt-2 mr-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
              <div className="inline-flex items-start px-3 py-2 rounded-full bg-gray-100 text-gray-800">
                <span className="font-semibold mr-1">Username:</span>
                <span>Unique identifier for the user.</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-2 mr-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
              <div className="inline-flex items-start px-3 py-2 rounded-full bg-gray-100 text-gray-800">
                <span className="font-semibold mr-1">Password:</span>
                <span>Must be at least 6 characters.</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-2 mr-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
              <div className="inline-flex items-start px-3 py-2 rounded-full bg-gray-100 text-gray-800">
                <span className="font-semibold mr-1">Role:</span>
                <span>Determines the user&apos;s permissions level.</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mt-2 mr-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
              <div className="inline-flex items-start px-3 py-2 rounded-full bg-gray-100 text-gray-800">
                <span className="font-semibold mr-1">Domain Access:</span>
                <span>Select which domains this user can access in the dashboard.</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Users created here will only be able to view data for the domains you select. To manage
              existing users, please use the{" "}
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
              >
                Admin Dashboard
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

