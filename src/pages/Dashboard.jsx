import { useMemo, useState } from "react";
import { FiFilter, FiCheck, FiRefreshCw, FiChevronUp, FiChevronDown, FiCalendar } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import LineChartCard from "../components/LineChartCard";
import DataTableCard from "../components/DataTableCard";
import dashboardData from "../data/dashboardData.json";

export default function Dashboard() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dateFilter, setDateFilter] = useState("month");
  // Use browser-friendly ISO date format so native calendar works
  const [startDate, setStartDate] = useState("2026-01-22");
  const [endDate, setEndDate] = useState("2026-02-20");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [domain, setDomain] = useState("");
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [chartRange, setChartRange] = useState("Last 7 Days");

  // ✅ Base chart data (used only when no rows match filters)
  const baseChartData = useMemo(() => dashboardData.baseChartData, []);

  const [tableSearch, setTableSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Dynamic Table Data (from single JSON source)
  const [tableData] = useState(dashboardData.tableData);

  const filteredTableData = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();

    // Real "today" based on the current date (e.g. 27 Feb 2026)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Optional extra range from Start Date / End Date calendars (yyyy-mm-dd)
    // We only use the "applied" values, set when user clicks Apply Filter.
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

      // Preset buttons: Today / Last 7 Days / This Month
      // If a custom range is applied, we ignore the preset and let the range control everything.
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

      // Extra range filter from the calendars (works together with presets)
      let matchesRange = true;
      if (rangeStart) {
        matchesRange = matchesRange && rowDate >= rangeStart;
      }
      if (rangeEnd) {
        matchesRange = matchesRange && rowDate <= rangeEnd;
      }

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

  // ✅ Build chart data dynamically from whatever rows are currently visible
  const chartData = useMemo(() => {
    // If no rows match the filters (e.g. March when we only have Jan–Feb),
    // return an empty dataset so the chart shows no line instead of fake data.
    if (filteredTableData.length === 0) {
      return [];
    }

    const byDate = new Map();
    filteredTableData.forEach((row) => {
      const label = row.date.split(",")[0]; // "Feb 1, 2026" -> "Feb 1"
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

  // ✅ Aggregate numbers from filtered data for dynamic stats
  const aggregated = useMemo(() => {
    // No rows for this range (e.g. month with no data) – everything is zero.
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

  // ✅ Dynamic stats cards based on filtered data
  const stats = useMemo(() => {
    return dashboardData.stats.map((item) => {
      if (item.title === "Total Earnings") {
        return {
          ...item,
          value: Number(aggregated.totalRevenue.toFixed(2)),
          isCurrency: true,
        };
      }
      if (item.title === "Select Range") {
        return {
          ...item,
          value: Number(aggregated.avgRevenue.toFixed(2)),
          isCurrency: true,
        };
      }
      if (item.title === "Last & Next 7 Days") {
        return {
          ...item,
          value: Number(aggregated.totalRevenue.toFixed(2)),
          isCurrency: true,
        };
      }
      if (item.title === "Page Views") {
        return {
          ...item,
          value: aggregated.totalImpressions,
        };
      }
      if (item.title === "Impressions") {
        return {
          ...item,
          value: aggregated.totalImpressions,
        };
      }
      if (item.title === "Clicks") {
        return {
          ...item,
          value: aggregated.totalClicks,
        };
      }
      return item;
    });
  }, [aggregated]);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage) || 1;
  const paginatedTableData = filteredTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const pageNumbers =
    totalPages > 1
      ? Array.from({ length: totalPages }, (_, idx) => idx + 1)
      : [];

  return (
    <div className="bg-[#f4f6fb] min-h-screen px-4 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ================= FILTER ================= */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
              <span className="text-blue-600">
                <FiFilter className="w-5 h-5" />
              </span>
              Filter Option
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  // Apply the current calendar values as active range
                  setAppliedStartDate(startDate);
                  setAppliedEndDate(endDate);
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
              >
                <FiCheck className="w-4 h-4" /> Apply Filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateFilter("month");
                  setStartDate("2026-01-22");
                  setEndDate("2026-02-20");
                  setAppliedStartDate("");
                  setAppliedEndDate("");
                  setDomain("");
                  setTableSearch("");
                  setCurrentPage(1);
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-200"
              >
                <FiRefreshCw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label={filterOpen ? "Collapse filter" : "Expand filter"}
              >
                {filterOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="px-6 pb-6 pt-0 border-t border-gray-100">
              <div className="flex flex-wrap gap-6 items-end pt-4">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Domain List</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => {
                        setDomain(e.target.value);
                        setDomainDropdownOpen(true);
                      }}
                      onFocus={() => setDomainDropdownOpen(true)}
                      placeholder="Search or select domain (e.g. Finrezo.com)"
                      className="border border-gray-200 rounded-lg pl-3 pr-9 py-2.5 text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setDomainDropdownOpen((open) => !open)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 px-2 py-1 rounded-md hover:bg-gray-100"
                    >
                      ▾
                    </button>
                    {domainDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg text-sm">
                        {Array.from(
                          new Set(tableData.map((row) => row.site))
                        )
                          .filter((site) =>
                            site
                              .toLowerCase()
                              .includes(domain.toLowerCase().trim())
                          )
                          .map((site) => (
                            <button
                              key={site}
                              type="button"
                              onClick={() => {
                                setDomain(site);
                                setDomainDropdownOpen(false);
                                setCurrentPage(1);
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-blue-50"
                            >
                              {site}
                            </button>
                          ))}
                        {Array.from(new Set(tableData.map((row) => row.site)))
                          .filter((site) =>
                            site
                              .toLowerCase()
                              .includes(domain.toLowerCase().trim())
                          ).length === 0 && (
                          <div className="px-3 py-2 text-gray-400">
                            No domains found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Filter</label>
                  <div className="flex gap-1 p-0.5 border border-gray-200 rounded-lg bg-gray-50/50">
                    {[
                      { id: "today", label: "Today" },
                      { id: "week", label: "Last 7 Days" },
                      { id: "month", label: "This Month" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDateFilter(opt.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          dateFilter === opt.id
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FiCalendar className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div
                    className={`w-12 h-12 rounded-full ${
                      item.bgClass ?? "bg-blue-50"
                    } flex items-center justify-center`}
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                )}
                <p className="text-black text-sm font-semibold">{item.title}</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <h3 className="text-2xl font-semibold">
                  {typeof item.value === "number" && item.isCurrency
                    ? `$${item.value}`
                    : item.value}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.change < 0
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                </span>
              </div>

              {item.title === "Total Earnings" && (
                <div className="mt-4 rounded-xl bg-green-50 px-4 py-2 flex items-center gap-2 text-sm text-green-700">
                  <span className="text-base leading-none text-green-600">↑</span>
                  <span className=" text-base">Overall</span>
                </div>
              )}
                 {item.title === "Select Range" && (
                <div className="mt-4  rounded-xl  px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className=" text-base font-semibold">Current Filter Periode</span>
                </div>
              )}
               {item.title === "Last & Next 7 Days" && (
                <div className="mt-4  rounded-xl  px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className=" text-base font-semibold">Recent week performance</span>
                </div>
              )}
               {item.title === "Page Views" && (
                <div className="mt-4  rounded-xl  px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className=" text-base font-semibold">Total visitor views</span>
                </div>
              )}
               {item.title === "Impressions" && (
                <div className="mt-4  rounded-xl  px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className=" text-base font-semibold">Ad display count</span>
                </div>
              )}
               {item.title === "Clicks" && (
                <div className="mt-4  rounded-xl  px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className=" text-base font-semibold">Ad interaction count</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ================= CHART (reusable component) ================= */}
        <div className="mb-6">
          <LineChartCard
            data={chartData}
            title="Daily Performance"
            subtitle={chartRange}
            dataKey="revenue"
            xAxisKey="day"
            height={320}
            valueLabel="Daily Earning ($)"
            showLegend
            rightHeader={
              <select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
              >
                <option>Last 7 Days</option>
                <option>Last 14 Days</option>
                <option>This Month</option>
              </select>
            }
          />
        </div>

        {/* ================= TABLE (reusable component) ================= */}
        <DataTableCard
          title="Detailed Report"
          searchPlaceholder="Search..."
          searchValue={tableSearch}
          onSearchChange={(value) => {
            setTableSearch(value);
            setCurrentPage(1);
          }}
          rightHeader={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  // Apply the current calendar values to the active range filter
                  setAppliedStartDate(startDate);
                  setAppliedEndDate(endDate);
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                <AiOutlinePlus /> Apply Filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setTableSearch("");
                  setAppliedStartDate("");
                  setAppliedEndDate("");
                  setStartDate("2026-01-22");
                  setEndDate("2026-02-20");
                  setDateFilter("month");
                  setDomain("");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          }
          columns={[
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
          ]}
          data={paginatedTableData}
          pagination={
            totalPages > 1
              ? {
                  currentPage,
                  totalPages,
                  onPageChange: setCurrentPage,
                  pageNumbers,
                }
              : undefined
          }
        />

      </div>
    </div>
  );
}