import { useMemo, useState } from "react";
import { getCurrentUser } from "../utils/authStorage";
import { filterDataByUserDomains } from "../utils/domainFilter";

/** Default column definitions for the dashboard table (key, label, optional render). */
export const DASHBOARD_TABLE_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "appId", label: "App ID" },
  { key: "site", label: "Site" },
  {
    key: "revenue",
    label: "Revenue",
    render: (row) => `$${row.revenue.toFixed(2)}`,
    cellClassName: "font-medium text-gray-800",
  },
  { key: "impressions", label: "Impressions" },
  { key: "clicks", label: "Clicks" },
  { key: "ectr", label: "eCTR" },
  {
    key: "ctr",
    label: "CTR",
    render: (row) => `${row.ctr.toFixed(2)}%`,
  },
  { key: "adExchangeMatchRate", label: "Ad Exchange Match Rate" },
  { key: "totalFillRate", label: "Total Fill Rate" },
];

const ROWS_PER_PAGE = 10;
const DEFAULT_START = "2026-01-22";
const DEFAULT_END = "2026-02-20";

/**
 * All Apply Filter and table logic for the Dashboard: date/domain filters,
 * table search, column visibility, filtered data, chart data, stats, pagination.
 *
 * @param {object} dashboardData - { tableData, stats }
 * @returns {object} State, setters, derived data, and handlers for the Dashboard UI.
 */
export function useDashboardFilters(dashboardData) {
  const currentUser = getCurrentUser();
  const rawTableData = dashboardData?.tableData ?? [];
  const tableData = useMemo(
    () => filterDataByUserDomains(rawTableData, "site"),
    [rawTableData, currentUser?.username]
  );
  const statsTemplate = dashboardData?.stats ?? [];

  const [filterOpen, setFilterOpen] = useState(true);
  const [dateFilter, setDateFilter] = useState("month");
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [endDate, setEndDate] = useState(DEFAULT_END);
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [domain, setDomain] = useState("");
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [chartRange, setChartRange] = useState("Last 7 Days");

  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [columnPickerOpen, setColumnPickerOpen] = useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() =>
    DASHBOARD_TABLE_COLUMNS.map((c) => c.key)
  );
  const [draftColumnKeys, setDraftColumnKeys] = useState(() =>
    DASHBOARD_TABLE_COLUMNS.map((c) => c.key)
  );

  const visibleTableColumns = useMemo(() => {
    const set = new Set(visibleColumnKeys);
    return DASHBOARD_TABLE_COLUMNS.filter((c) => set.has(c.key));
  }, [visibleColumnKeys]);

  const filteredTableData = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasStart = Boolean(appliedStartDate);
    const hasEnd = Boolean(appliedEndDate);
    const hasRange = hasStart || hasEnd;
    const rangeStart = hasStart ? new Date(appliedStartDate) : null;
    const rangeEnd = hasEnd ? new Date(appliedEndDate) : null;
    if (rangeStart) rangeStart.setHours(0, 0, 0, 0);
    if (rangeEnd) rangeEnd.setHours(0, 0, 0, 0);

    return tableData.filter((row) => {
      const matchesSearch = q
        ? `${row.date} ${row.appId} ${row.site}`.toLowerCase().includes(q)
        : true;

      const rowDate = new Date(row.date);
      rowDate.setHours(0, 0, 0, 0);

      let matchesDatePreset = true;
      if (!hasRange) {
        if (dateFilter === "today") {
          matchesDatePreset = rowDate.getTime() === today.getTime();
        } else if (dateFilter === "week") {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);
          matchesDatePreset = rowDate >= sevenDaysAgo && rowDate <= today;
        } else if (dateFilter === "month") {
          matchesDatePreset =
            rowDate.getMonth() === today.getMonth() &&
            rowDate.getFullYear() === today.getFullYear();
        }
      }

      let matchesRange = true;
      if (rangeStart) matchesRange = matchesRange && rowDate >= rangeStart;
      if (rangeEnd) matchesRange = matchesRange && rowDate <= rangeEnd;

      const matchesDomain = domain
        ? row.site.toLowerCase().includes(domain.toLowerCase())
        : true;

      return (
        matchesSearch &&
        matchesDatePreset &&
        matchesRange &&
        matchesDomain
      );
    });
  }, [tableSearch, tableData, domain, dateFilter, appliedStartDate, appliedEndDate]);

  const chartData = useMemo(() => {
    if (filteredTableData.length === 0) return [];

    const byDate = new Map();
    filteredTableData.forEach((row) => {
      const label = row.date.split(",")[0];
      const prev = byDate.get(label) ?? 0;
      byDate.set(label, prev + row.revenue);
    });

    return Array.from(byDate.entries())
      .map(([day, revenue]) => ({
        day,
        revenue: Number(revenue.toFixed(2)),
      }))
      .sort(
        (a, b) =>
          new Date(`${a.day}, 2026`).getTime() -
          new Date(`${b.day}, 2026`).getTime()
      );
  }, [filteredTableData]);

  const aggregated = useMemo(() => {
    if (filteredTableData.length === 0) {
      return {
        totalRevenue: 0,
        avgRevenue: 0,
        totalImpressions: 0,
        totalClicks: 0,
      };
    }

    let totalRevenue = 0;
    let totalImpressions = 0;
    let totalClicks = 0;

    filteredTableData.forEach((row) => {
      totalRevenue += row.revenue;
      totalImpressions += row.impressions;
      totalClicks += row.clicks;
    });

    return {
      totalRevenue,
      avgRevenue: totalRevenue / filteredTableData.length,
      totalImpressions,
      totalClicks,
    };
  }, [filteredTableData]);

  const stats = useMemo(() => {
    return statsTemplate.map((item) => {
      if (item.title === "Total Earnings") {
        return { ...item, value: Number(aggregated.totalRevenue.toFixed(2)), isCurrency: true };
      }
      if (item.title === "Select Range") {
        return { ...item, value: Number(aggregated.avgRevenue.toFixed(2)), isCurrency: true };
      }
      if (item.title === "Last & Next 7 Days") {
        return { ...item, value: Number(aggregated.totalRevenue.toFixed(2)), isCurrency: true };
      }
      if (item.title === "Page Views") {
        return { ...item, value: aggregated.totalImpressions };
      }
      if (item.title === "Impressions") {
        return { ...item, value: aggregated.totalImpressions };
      }
      if (item.title === "Clicks") {
        return { ...item, value: aggregated.totalClicks };
      }
      return item;
    });
  }, [statsTemplate, aggregated]);

  const totalPages = Math.ceil(filteredTableData.length / ROWS_PER_PAGE) || 1;
  const paginatedTableData = filteredTableData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );
  const pageNumbers =
    totalPages > 1
      ? Array.from({ length: totalPages }, (_, idx) => idx + 1)
      : [];

  const applyFilter = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setCurrentPage(1);
  };

  const resetAll = () => {
    setDateFilter("month");
    setStartDate(DEFAULT_START);
    setEndDate(DEFAULT_END);
    setAppliedStartDate("");
    setAppliedEndDate("");
    setDomain("");
    setTableSearch("");
    setVisibleColumnKeys(DASHBOARD_TABLE_COLUMNS.map((c) => c.key));
    setDraftColumnKeys(DASHBOARD_TABLE_COLUMNS.map((c) => c.key));
    setCurrentPage(1);
  };

  const openColumnPicker = () => {
    setDraftColumnKeys(visibleColumnKeys);
    setColumnPickerOpen(true);
  };

  const applyColumnPicker = () => {
    if (draftColumnKeys.length === 0) return;
    setVisibleColumnKeys(draftColumnKeys);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setCurrentPage(1);
    setColumnPickerOpen(false);
  };

  const closeColumnPicker = () => setColumnPickerOpen(false);

  const resetTableFilters = () => {
    setTableSearch("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setStartDate(DEFAULT_START);
    setEndDate(DEFAULT_END);
    setDateFilter("month");
    setDomain("");
    setVisibleColumnKeys(DASHBOARD_TABLE_COLUMNS.map((c) => c.key));
    setDraftColumnKeys(DASHBOARD_TABLE_COLUMNS.map((c) => c.key));
    setCurrentPage(1);
  };

  const setTableSearchAndResetPage = (value) => {
    setTableSearch(value);
    setCurrentPage(1);
  };

  const setDomainAndResetPage = (value) => {
    setDomain(value);
    setCurrentPage(1);
  };

  return {
    // Filter panel
    filterOpen,
    setFilterOpen,
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    domain,
    setDomain, // for typing in the domain input
    domainDropdownOpen,
    setDomainDropdownOpen,
    chartRange,
    setChartRange,

    // Table
    tableData,
    tableSearch,
    setTableSearch: setTableSearchAndResetPage,
    currentPage,
    setCurrentPage,

    // Column picker
    allTableColumns: DASHBOARD_TABLE_COLUMNS,
    columnPickerOpen,
    draftColumnKeys,
    setDraftColumnKeys,
    visibleTableColumns,
    visibleColumnKeys,

    // Derived data
    filteredTableData,
    chartData,
    aggregated,
    stats,

    // Pagination
    rowsPerPage: ROWS_PER_PAGE,
    totalPages,
    paginatedTableData,
    pageNumbers,

    // Handlers
    applyFilter,
    resetAll,
    openColumnPicker,
    applyColumnPicker,
    closeColumnPicker,
    resetTableFilters,
    setDomainAndResetPage,
  };
}
