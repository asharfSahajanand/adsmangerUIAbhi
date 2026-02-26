import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const ROLES = ["Admin", "Publisher"];

const MOCK_DOMAINS = [
  "Advance (4437565058) - partner-pub-2471157282524836:4437565058",
  "Advance (4437565059) - partner-pub-2471157282524836:4437565059",
  "Advance (4437565060) - partner-pub-2471157282524836:4437565060",
  "Advance (4437565061) - partner-pub-2471157282524836:4437565061",
  "Advance (4437565062) - partner-pub-2471157282524836:4437565062",
  "Advance (4437565063) - partner-pub-2471157282524836:4437565063",
];

/**
 * AddNewUserModal – Modal form for adding a new user: username, password, role, domain access list.
 * Use: open when "Add User" is clicked on Admin page.
 */
export default function AddNewUserModal({ open, onClose, onSave }) {
  const [username, setUsername] = useState("Master");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [selectAllDomain, setSelectAllDomain] = useState(false);
  const [domainSearch, setDomainSearch] = useState("");
  const [selectedDomains, setSelectedDomains] = useState({});

  if (!open) return null;

  const filteredDomains = MOCK_DOMAINS.filter((d) =>
    d.toLowerCase().includes(domainSearch.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    setSelectAllDomain(checked);
    const next = {};
    filteredDomains.forEach((d) => { next[d] = checked; });
    setSelectedDomains((prev) => ({ ...prev, ...next }));
  };

  const handleDomainToggle = (domain, checked) => {
    setSelectedDomains((prev) => ({ ...prev, [domain]: checked }));
  };

  const handleSave = () => {
    onSave?.({ username, password, role, selectedDomains });
    setUsername("Master");
    setPassword("");
    setRole("Admin");
    setSelectAllDomain(false);
    setSelectedDomains({});
    setDomainSearch("");
    onClose?.();
  };

  const handleCancel = () => {
    setUsername("Master");
    setPassword("");
    setRole("Admin");
    setSelectAllDomain(false);
    setSelectedDomains({});
    setDomainSearch("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleCancel}
        aria-hidden
      />
      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
        </div>

        <div className="p-6 flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-3">Domain Access</h3>
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAllDomain}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Select All Domain</span>
              </label>
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  placeholder="Search domain..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              {filteredDomains.map((domain) => (
                <label
                  key={domain}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDomains[domain] ?? false}
                    onChange={(e) => handleDomainToggle(domain, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 truncate">{domain}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="min-w-[140px] px-6 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="min-w-[140px] px-6 py-2.5 rounded-full text-sm font-medium bg-gray-300 text-gray-800 hover:bg-gray-200 shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
