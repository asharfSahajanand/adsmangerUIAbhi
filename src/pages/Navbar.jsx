import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiChevronDown, FiLogOut } from "react-icons/fi";
import { clearCurrentUser, getCurrentUser } from "../utils/authStorage";

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const navClass =
    "w-full md:w-auto text-center px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors whitespace-nowrap";
  const activeClass = "bg-blue-500 text-white shadow-sm";
  const inactiveClass = "text-gray-600 hover:text-gray-800";

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    clearCurrentUser();
    navigate("/");
  };

  return (
    <nav className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <img
            src="/ads manager.png"
            alt="Google Ad Manager"
            className="h-8 w-auto object-contain"
          />
        </NavLink>
      </div>

      {/* Center: Nav tabs */}
      <div className="w-full md:w-auto">
        <div className="grid grid-cols-2 md:flex md:flex-nowrap justify-center gap-1 bg-gray-200/80 px-1 py-1 rounded-xl shadow-sm border border-gray-200/60">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${navClass} ${isActive ? activeClass : inactiveClass}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/reporting"
            className={({ isActive }) => `${navClass} ${isActive ? activeClass : inactiveClass}`}
          >
            Reporting
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `${navClass} ${isActive ? activeClass : inactiveClass}`}
          >
            Admin
          </NavLink>
          <NavLink
            to="/domain-user"
            className={({ isActive }) => `${navClass} ${isActive ? activeClass : inactiveClass}`}
          >
            Domain User
          </NavLink>
        </div>
      </div>

      {/* Right: User dropdown - keep same button UI, just show Logout when clicked */}
      <div className="relative flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((open) => !open)}
          className="flex items-center gap-2 border border-gray-300 bg-transparent px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <FiUser className="w-5 h-5 text-gray-800" />
          <span className="text-sm font-medium text-gray-800">{currentUser?.username ?? "User"}</span>
          <FiChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg py-0.5 z-10">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span>Logout</span>
              <FiLogOut className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}