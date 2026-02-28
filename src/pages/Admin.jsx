import { useState, useMemo } from "react";
import { FiPlusCircle, FiEdit2, FiList, FiChevronDown } from "react-icons/fi";
import AddNewUserModal from "../components/AddNewUserModal";
import EditChannelPermissionsModal from "../components/EditChannelPermissionsModal";
import EditUserRolesModal from "../components/EditUserRolesModal";
import { getAllUsers } from "../utils/authStorage";

const initialUsers = [
  { id: "01", userName: "Master", domain: "xyz.com", role: "Admin" },
  { id: "02", userName: "Master2", domain: "xyz.com", role: "Publisher" },
  { id: "03", userName: "Master3", domain: "xyz.com", role: "Publisher" },
  { id: "04", userName: "Master4", domain: "xyz.com", role: "Publisher" },
  { id: "05", userName: "Master5", domain: "xyz.com", role: "Publisher" },
  { id: "06", userName: "Master6", domain: "xyz.com", role: "Publisher" },
  { id: "07", userName: "Master7", domain: "xyz.com", role: "Publisher" },
  { id: "08", userName: "Master8", domain: "xyz.com", role: "Publisher" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("user");
  const [users, setUsers] = useState(initialUsers);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editChannelsUser, setEditChannelsUser] = useState(null);
  const [domainPermissionsUserSelect, setDomainPermissionsUserSelect] = useState("");
  const [domainPermissionsDropdownOpen, setDomainPermissionsDropdownOpen] = useState(false);

  const allStoredUsers = useMemo(() => getAllUsers(), [addUserModalOpen]);
  const selectedUserForDomains = useMemo(
    () => allStoredUsers.find((u) => (u.username || "").toLowerCase() === domainPermissionsUserSelect.toLowerCase()) || null,
    [allStoredUsers, domainPermissionsUserSelect]
  );
  const assignedDomains = selectedUserForDomains?.domains ?? [];
  const assignedDomainsCount = Array.isArray(assignedDomains) ? assignedDomains.length : 0;

  return (
    <div className="bg-[#f4f6fb] min-h-screen px-4 py-6 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page title & subtitle - on light grey background */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin User Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Admin dashboard to manage users, roles, permissions efficiently
          </p>
        </div>

        {/* Single white rounded card - tabs, user list, table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-visible">
          {/* Tabs - User (active with blue underline) | Domain Permissions */}
          <div className="border-b border-gray-200 px-6 pt-5">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("user")}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "user"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                User
              </button>
              <button
                onClick={() => setActiveTab("domain-permissions")}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "domain-permissions"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Domain Permissions
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "user" && (
              <>
                {/* User List heading + Add User pill button */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h2 className="text-lg font-bold text-gray-800">User List</h2>
                  <button
                    onClick={() => setAddUserModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700"
                  >
                    <FiPlusCircle className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                {/* Table - light grey horizontal lines between rows */}
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200">
                        <th className="pl-6 pr-10 py-3.5 text-left font-semibold text-gray-600">ID No.</th>
                        <th className="px-6 py-3.5 text-left font-semibold text-gray-600">User Name</th>
                        <th className="px-6 py-3.5 text-left font-semibold text-gray-600">Domain</th>
                        <th className="px-6 py-3.5 text-left font-semibold text-gray-600">Roles</th>
                        <th className="px-6 py-3.5 text-left font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-200 last:border-b-0 bg-white hover:bg-gray-50/50"
                        >
                          <td className="pl-6 pr-10 py-3.5 text-gray-700">{user.id}</td>
                          <td className="px-6 py-3.5 font-medium text-gray-800">{user.userName}</td>
                          <td className="px-6 py-3.5 text-gray-700">{user.domain}</td>
                          <td className="px-6 py-3.5 text-gray-700">{user.role}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-700"
                                onClick={() => setEditUser(user)}
                              >
                                <FiEdit2 className="w-3.5 h-3.5 shrink-0" /> Edit User
                              </button>
                              <button
                                className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-green-200"
                                onClick={() => setEditChannelsUser(user)}
                              >
                                <FiList className="w-3.5 h-3.5 shrink-0" /> Edit Channels
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === "domain-permissions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Domain Permissions
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage which users have access to specific domains.
                    </p>
                  </div>
                  <button
                    onClick={() => setAddUserModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700"
                  >
                    <FiPlusCircle className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Select User
                  </label>
                  <div className="relative w-full max-w-xl">
                    <button
                      type="button"
                      onClick={() => setDomainPermissionsDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <span className={domainPermissionsUserSelect ? "text-gray-800" : "text-gray-400"}>
                        {selectedUserForDomains
                          ? `${selectedUserForDomains.username}${selectedUserForDomains.role ? ` (${selectedUserForDomains.role})` : ""}`
                          : "Select User"}
                      </span>
                      <FiChevronDown
                        className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${domainPermissionsDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {domainPermissionsDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-[1000]"
                          aria-hidden
                          onClick={() => setDomainPermissionsDropdownOpen(false)}
                        />
                        <div className="absolute z-[1001] mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl py-1 max-h-60 overflow-auto">
                          {allStoredUsers.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">No users found</div>
                          ) : (
                            allStoredUsers.map((u) => (
                              <button
                                key={u.username}
                                type="button"
                                onClick={() => {
                                  setDomainPermissionsUserSelect(u.username || "");
                                  setDomainPermissionsDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-800 hover:bg-blue-50 flex items-center justify-between"
                              >
                                <span>{u.username}</span>
                                {u.role && (
                                  <span className="text-xs text-gray-500">{u.role}</span>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedUserForDomains && (
                    <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Domains assigned to this user
                      </p>
                      <p className="text-sm text-gray-600">
                        {assignedDomainsCount === 0 ? (
                          "No domains assigned. This user has access to all data (admin-like)."
                        ) : (
                          <>
                            <span className="font-medium text-gray-800">{assignedDomainsCount} domain{assignedDomainsCount !== 1 ? "s" : ""} assigned:</span>{" "}
                            {assignedDomains.join(", ")}
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddNewUserModal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onSave={(data) => {
          const nextId = String(users.length + 1).padStart(2, "0");
          setUsers((prev) => [
            ...prev,
            { id: nextId, userName: data.username, domain: "xyz.com", role: data.role },
          ]);
        }}
      />

      <EditChannelPermissionsModal
        open={!!editChannelsUser}
        user={editChannelsUser}
        onClose={() => setEditChannelsUser(null)}
      />

      <EditUserRolesModal
        open={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={(newRole) => {
          if (!editUser) return;
          setUsers((prev) =>
            prev.map((u) =>
              u.id === editUser.id ? { ...u, role: newRole } : u
            )
          );
          setEditUser(null);
        }}
      />
    </div>
  );
}
