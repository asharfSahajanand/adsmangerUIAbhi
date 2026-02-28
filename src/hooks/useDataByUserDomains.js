import { useMemo } from "react";
import { getCurrentUser } from "../utils/authStorage";
import { filterDataByUserDomains } from "../utils/domainFilter";

/**
 * Reusable hook: returns table/data filtered by current user's assigned domains.
 * - Admin or user with no domains → all data.
 * - Domain user with assigned domains → only rows where row[siteKey] is in user.domains.
 *
 * @param {object[]} data - Raw rows (e.g. tableData from JSON)
 * @param {string} [siteKey='site'] - Property name for domain/site on each row
 * @returns {object[]} Filtered data for the current user
 */
export function useDataByUserDomains(data, siteKey = "site") {
  const currentUser = getCurrentUser();
  return useMemo(
    () => filterDataByUserDomains(Array.isArray(data) ? data : [], siteKey),
    [data, siteKey, currentUser?.username]
  );
}
