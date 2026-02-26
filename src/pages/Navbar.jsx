import { NavLink } from "react-router-dom";
import { FiUser, FiChevronDown } from "react-icons/fi";

export default function Navbar() {
  const navClass = "px-5 py-2.5 text-sm font-medium rounded-full transition-colors";
  const activeClass = "bg-blue-500 text-white shadow-sm";
  const inactiveClass = "text-gray-600 hover:text-gray-800";

  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
      
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          {/* Three diagonal lines: blue, green, yellow */}
          <div className="flex flex-col gap-1">
            <div className="w-5 h-0.5 bg-blue-500 rounded-full transform -rotate-45 origin-left" />
            <div className="w-5 h-0.5 bg-green-500 rounded-full transform -rotate-45 origin-left" />
            <div className="w-5 h-0.5 bg-amber-400 rounded-full transform -rotate-45 origin-left" />
          </div>
          <span className="text-gray-900 font-medium text-sm">
            Google Ad Manager
          </span>
        </NavLink>
      </div>

      {/* Center: Nav tabs */}
      <div className="flex items-center gap-1 bg-gray-200/80 px-1 py-1 rounded-xl shadow-sm border border-gray-200/60">
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
        <button className={`${navClass} ${inactiveClass}`}>
          Admin
        </button>
        <button className={`${navClass} ${inactiveClass}`}>
          Domain User
        </button>
      </div>

      {/* Right: User dropdown - bordered, person icon + Master + arrow */}
      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center gap-2 border border-gray-300 bg-transparent px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <FiUser className="w-5 h-5 text-gray-800" />
          <span className="text-sm font-medium text-gray-800">Master</span>
          <FiChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>

    </nav>
  );
}