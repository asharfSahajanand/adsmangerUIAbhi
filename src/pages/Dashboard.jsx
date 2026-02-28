import { FiFilter, FiCheck, FiRefreshCw, FiChevronUp, FiChevronDown, FiCalendar } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import LineChartCard from "../components/LineChartCard";
import DataTableCard from "../components/DataTableCard";
import dashboardData from "../data/dashboardData.json";
import { useDashboardFilters } from "../hooks/useDashboardFilters";

export default function Dashboard() {
  const {
    filterOpen,
    setFilterOpen,
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    domain,
    setDomain,
    domainDropdownOpen,
    setDomainDropdownOpen,
    chartRange,
    setChartRange,
    tableData,
    tableSearch,
    setTableSearch,
    currentPage,
    setCurrentPage,
    allTableColumns,
    columnPickerOpen,
    draftColumnKeys,
    setDraftColumnKeys,
    visibleTableColumns,
    chartData,
    stats,
    totalPages,
    paginatedTableData,
    pageNumbers,
    applyFilter,
    resetAll,
    openColumnPicker,
    applyColumnPicker,
    closeColumnPicker,
    resetTableFilters,
    setDomainAndResetPage,
  } = useDashboardFilters(dashboardData);

  return (
    <div className="bg-[#f4f6fb] min-h-screen px-3 py-4 sm:px-6 sm:py-6 min-w-0">
      <div className="max-w-7xl mx-auto min-w-0">

        {/* ================= FILTER ================= */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 sm:mb-6 overflow-visible">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base sm:text-lg shrink-0">
              <span className="text-blue-600">
                <FiFilter className="w-5 h-5" />
              </span>
              Filter Option
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={applyFilter}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 whitespace-nowrap"
              >
                <FiCheck className="w-4 h-4 shrink-0" /> Apply Filter
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-200 whitespace-nowrap"
              >
                <FiRefreshCw className="w-4 h-4 shrink-0" /> Reset
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 shrink-0"
                aria-label={filterOpen ? "Collapse filter" : "Expand filter"}
              >
                {filterOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 sm:gap-6 items-end pt-4">
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
                      <>
                        <div
                          className="fixed inset-0 z-[1000]"
                          aria-hidden
                          onClick={() => setDomainDropdownOpen(false)}
                        />
                        <div className="absolute z-[1001] mt-1 w-full min-w-[14rem] max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl py-1 text-sm">
                          {Array.from(new Set(tableData.map((row) => row.site)))
                            .filter((site) =>
                              site.toLowerCase().includes(domain.toLowerCase().trim())
                            )
                            .map((site) => (
                              <button
                                key={site}
                                type="button"
                                onClick={() => {
                                  setDomainAndResetPage(site);
                                  setDomainDropdownOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2.5 hover:bg-blue-50 text-gray-800 whitespace-nowrap"
                              >
                                {site}
                              </button>
                            ))}
                          {Array.from(new Set(tableData.map((row) => row.site))).filter((site) =>
                            site.toLowerCase().includes(domain.toLowerCase().trim())
                          ).length === 0 && (
                            <div className="px-3 py-2 text-gray-400">No domains found</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full sm:w-auto min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Filter</label>
                  <div className="flex flex-wrap gap-1 p-0.5 border border-gray-200 rounded-lg bg-gray-50/50">
                    {[
                      { id: "today", label: "Today" },
                      { id: "week", label: "Last 7 Days" },
                      { id: "month", label: "This Month" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDateFilter(opt.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                          dateFilter === opt.id
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FiCalendar className="w-4 h-4 shrink-0" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full sm:w-auto min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full sm:w-auto min-w-0">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm min-w-0">
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div
                    className={`w-12 h-12 rounded-full ${item.bgClass ?? "bg-blue-50"} flex items-center justify-center`}
                  >
                    <img src={item.icon} alt={item.title} className="w-6 h-6 object-contain" />
                  </div>
                )}
                <p className="text-black text-sm font-semibold">{item.title}</p>
              </div>
              <div className="flex items-center gap-3 mt-3 min-w-0">
                <h3 className="text-xl sm:text-2xl font-semibold truncate">
                  {typeof item.value === "number" && item.isCurrency ? `$${item.value}` : item.value}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.change < 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                </span>
              </div>

              {item.title === "Total Earnings" && (
                <div className="mt-4 rounded-xl bg-green-50 px-4 py-2 flex items-center gap-2 text-sm text-green-700">
                  <span className="text-base leading-none text-green-600">↑</span>
                  <span className="text-base">Overall</span>
                </div>
              )}
              {item.title === "Select Range" && (
                <div className="mt-4 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className="text-base font-semibold">Current Filter Periode</span>
                </div>
              )}
              {item.title === "Last & Next 7 Days" && (
                <div className="mt-4 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className="text-base font-semibold">Recent week performance</span>
                </div>
              )}
              {item.title === "Page Views" && (
                <div className="mt-4 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className="text-base font-semibold">Total visitor views</span>
                </div>
              )}
              {item.title === "Impressions" && (
                <div className="mt-4 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className="text-base font-semibold">Ad display count</span>
                </div>
              )}
              {item.title === "Clicks" && (
                <div className="mt-4 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-black-700">
                  <span className="text-base font-semibold">Ad interaction count</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ================= CHART ================= */}
        <div className="mb-4 sm:mb-6 overflow-hidden">
          <LineChartCard
            data={chartData}
            title="Daily Performance"
            subtitle={chartRange}
            dataKey="revenue"
            xAxisKey="day"
            height={280}
            valueLabel="Daily Earning ($)"
            showLegend
            rightHeader={
              <select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 w-full min-w-0 sm:w-auto"
              >
                <option>Last 7 Days</option>
                <option>Last 14 Days</option>
                <option>This Month</option>
              </select>
            }
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-hidden">
          <DataTableCard
            title="Detailed Report"
            searchPlaceholder="Search..."
            searchValue={tableSearch}
            onSearchChange={setTableSearch}
            rightHeader={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openColumnPicker}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <AiOutlinePlus /> Apply Filter
                </button>
                <button
                  type="button"
                  onClick={resetTableFilters}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            }
            columns={visibleTableColumns}
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

        {/* ================= COLUMN PICKER MODAL ================= */}
        {columnPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/30"
              onClick={closeColumnPicker}
              aria-label="Close column picker"
            />
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Select columns</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Choose which column headers you want to show in the table.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeColumnPicker}
                  className="px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-auto border border-gray-100 rounded-xl p-3">
                {allTableColumns.map((col) => {
                  const checked = draftColumnKeys.includes(col.key);
                  return (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? Array.from(new Set([...draftColumnKeys, col.key]))
                            : draftColumnKeys.filter((k) => k !== col.key);
                          setDraftColumnKeys(next);
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{col.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftColumnKeys(allTableColumns.map((c) => c.key))}
                    className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftColumnKeys([])}
                    className="px-3 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeColumnPicker}
                    className="px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={draftColumnKeys.length === 0}
                    onClick={applyColumnPicker}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      draftColumnKeys.length === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
