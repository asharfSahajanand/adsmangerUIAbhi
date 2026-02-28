import { getCurrentUser } from "./authStorage";

/**
 * Reusable: filter rows by current user's assigned domains.
 * - Admin (or no user, or empty domains) → returns all data.
 * - Domain user with assigned domains → returns only rows where row[siteKey] is in user.domains.
 *
 * @param {object[]} rows - Array of row objects (e.g. table data)
 * @param {string} [siteKey='site'] - Property name for domain/site (e.g. 'site' for row.site)
 * @returns {object[]} Filtered rows
 */
export function filterDataByUserDomains(rows, siteKey = "site") {
  if (!Array.isArray(rows)) return [];
  const user = getCurrentUser();
  if (!user) return rows;
  const domains = user.domains;
  if (!domains || domains.length === 0 || (user.role && user.role.toLowerCase() === "admin")) {
    return rows;
  }
  const allowed = new Set(domains.map((d) => (d || "").toLowerCase().trim()));
  return rows.filter((row) => {
    const site = (row[siteKey] || "").toLowerCase().trim();
    return site && allowed.has(site);
  });
}
