import { useEffect, useState } from "react";

export default function EditUserRolesModal({ open, onClose, user, onSave }) {
  const [selectedRole, setSelectedRole] = useState(user?.role ?? "Admin");

  useEffect(() => {
    setSelectedRole(user?.role ?? "Admin");
  }, [user]);

  if (!open) return null;

  const handleSave = () => {
    onSave?.(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl max-h-[60vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Edit User Roles</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-1"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 max-w-xl">
          <p className="text-sm text-gray-700 mb-2">
            User: <span className="font-medium text-gray-900">{user?.userName}</span>
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <label className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRole === "Admin"}
                onChange={() => setSelectedRole("Admin")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800">
                <span className="font-medium">Admin</span> - All Access Admin
              </span>
            </label>

            <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRole === "Publisher"}
                onChange={() => setSelectedRole("Publisher")}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-800">
                <span className="font-medium">Publisher</span> - Specific Domain Access Only
              </span>
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[140px] px-6 py-2.5 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-w-[140px] px-6 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

