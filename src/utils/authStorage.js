import domainUsersData from "../data/domainUsers.json";

const STORAGE_KEY_CREATED = "domainUsersCreated";
const STORAGE_KEY_CURRENT = "currentUser";

export function getAllUsers() {
  const fromJson = domainUsersData?.users ?? [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CREATED);
    const created = stored ? JSON.parse(stored) : [];
    return [...fromJson, ...created];
  } catch {
    return fromJson;
  }
}

export function addUser(user) {
  const { username, password, role, domains } = user;
  const list = getAllUsers();
  if (list.some((u) => (u.username || "").toLowerCase() === (username || "").toLowerCase())) {
    return { ok: false, message: "Username already exists." };
  }
  const created = getCreatedUsers();
  created.push({
    username: (username || "").trim(),
    password,
    role: role || "Publisher",
    domains: Array.isArray(domains) ? domains : (domains || "").split(/\n/).map((d) => d.trim()).filter(Boolean),
  });
  localStorage.setItem(STORAGE_KEY_CREATED, JSON.stringify(created));
  return { ok: true };
}

function getCreatedUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CREATED);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function validateLogin(username, password) {
  const users = getAllUsers();
  const u = users.find(
    (user) =>
      (user.username || "").toLowerCase() === (username || "").trim().toLowerCase() &&
      user.password === password
  );
  if (!u) return null;
  return {
    username: u.username,
    role: u.role,
    domains: u.domains || [],
  };
}

export function setCurrentUser(user) {
  if (user) localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY_CURRENT);
}

export function getCurrentUser() {
  try {
    const s = localStorage.getItem(STORAGE_KEY_CURRENT);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY_CURRENT);
}
