import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const MOCK_DOMAINS = [
  "Advance (4437565058) - partner-pub-2471157282524836:4437565058",
  "Advance (4437565059) - partner-pub-2471157282524836:4437565059",
  "Advance (4437565060) - partner-pub-2471157282524836:4437565060",
  "Advance (4437565061) - partner-pub-2471157282524836:4437565061",
  "Advance (4437565062) - partner-pub-2471157282524836:4437565062",
  "Advance (4437565063) - partner-pub-2471157282524836:4437565063",
];

export default function EditChannelPermissionsModal({ open, onClose, user }) {
  const [domainSearch, setDomainSearch] = useState("");
  const [selectedDomains, setSelectedDomains] = useState({});

  if (!open) return null;

  const filteredDomains = MOCK_DOMAINS.filter((d) =>
    d.toLowerCase().includes(domainSearch.toLowerCase())
  );

  const totalDomains = MOCK_DOMAINS.length;
  const selectedCount = MOCK_DOMAINS.filter((d) => selectedDomains[d]).length;
  const allSelected = totalDomains > 0 && selectedCount === totalDomains;

  const handleSelectAll = () => {
    const nextChecked = !allSelected;
    const next = {};
    MOCK_DOMAINS.forEach((d) => {
      next[d] = nextChecked;
    });
    setSelectedDomains(next);
  };

  const handleDomainToggle = (domain, checked) => {
    setSelectedDomains((prev) => ({ ...prev, [domain]: checked }));
  };

  const hasAnySelected = Object.values(selectedDomains).some(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Channel Permissions
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            User: <span className="font-medium text-gray-800">{user?.userName}</span>
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-3">
              Domain Access
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
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
                    placeholder="Search domain...."
                    className="w-full border border-gray-200 rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                {filteredDomains.map((domain) => {
                  const isSelected = !!selectedDomains[domain];
                  return (
                    <label
                      key={domain}
                      className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 last:border-b-0 cursor-pointer ${
                        isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          handleDomainToggle(domain, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800 truncate">
                        {domain}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[140px] px-6 py-2.5 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm"
          >
            Close
          </button>
          <button
            type="button"
            disabled={!hasAnySelected}
            className={`min-w-[140px] px-6 py-2.5 rounded-full text-sm font-medium shadow-sm transition-colors ${
              hasAnySelected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

