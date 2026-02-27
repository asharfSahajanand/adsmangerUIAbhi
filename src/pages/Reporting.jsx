import { useMemo, useState } from "react";
import {
  FiFilter,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiChevronDown,
  FiCalendar,
} from "react-icons/fi";
import reportingData from "../data/reportingData.json";
import LineChartCard from "../components/LineChartCard";
import DataTableCard from "../components/DataTableCard";

export default function Reporting() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dateRange, setDateRange] = useState("month"); // today | week | month
  const [startDate, setStartDate] = useState("03-01-2025");
  const [endDate, setEndDate] = useState("05-03-2025");
  const [chartRange, setChartRange] = useState("Last 7 Days");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Summary cards from JSON, with icons attached here
  const summaryCards = reportingData.summaryCards.map((card) => {
    let icon = FiDollarSign;
    if (card.iconKey === "domain") icon = FiTrendingUp;
    else if (card.iconKey === "records") icon = FiFileText;
    return { ...card, icon };
  });

  // ✅ Table data from JSON
  const tableData = reportingData.tableData;

  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / rowsPerPage) || 1;
  const paginatedTableData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const pageNumbers =
    totalPages > 1
      ? Array.from({ length: totalPages }, (_, idx) => idx + 1)
      : [];

  const totals = tableData.reduce(
    (acc, row) => ({
      revenue: acc.revenue + row.revenue,
      impression: acc.impression + row.impression,
      eCTR: acc.eCTR + row.eCTR,
      ctr: acc.ctr + row.ctr,
      adExchangeMatch: acc.adExchangeMatch + row.adExchangeMatch,
      totalFill: acc.totalFill + row.totalFill,
    }),
    { revenue: 0, impression: 0, eCTR: 0, ctr: 0, adExchangeMatch: 0, totalFill: 0 }
  );

  const rowCount = tableData.length;
  const avgECTR = totals.eCTR / rowCount;
  const avgCTR = totals.ctr / rowCount;
  const avgAdExchangeMatch = totals.adExchangeMatch / rowCount;
  const avgTotalFill = totals.totalFill / rowCount;

  const chartData = [
    { date: "Feb 04", earning: 42.5 },
    { date: "Feb 05", earning: 45.2 },
    { date: "Feb 06", earning: 43.1 },
    { date: "Feb 07", earning: 47.8 },
    { date: "Feb 08", earning: 46.0 },
    { date: "Feb 09", earning: 48.5 },
    { date: "Feb 10", earning: 49.2 },
    { date: "Feb 11", earning: 49.34 },
    { date: "Feb 12", earning: 47.1 },
    { date: "Feb 13", earning: 45.8 },
    { date: "Feb 14", earning: 44.2 },
    { date: "Feb 15", earning: 46.5 },
    { date: "Feb 16", earning: 48.0 },
    { date: "Feb 17", earning: 47.3 },
    { date: "Feb 18", earning: 45.9 },
    { date: "Feb 19", earning: 44.8 },
    { date: "Feb 20", earning: 46.2 },
  ];

  return (
    <div className="bg-[#f4f6fb] min-h-screen px-4 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reporting</h1>
          <p className="text-gray-500 text-sm mt-1">
            Offers real-time and historical reporting for ad campaigns
          </p>
        </div>

        {/* ================= FILTER OPTION ================= */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FiFilter /> Filter Option
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                Generate Report
              </button>
              <button className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700">
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateRange("month");
                  setStartDate("03-01-2025");
                  setEndDate("05-03-2025");
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label={filterOpen ? "Collapse filter" : "Expand filter"}
              >
                <FiChevronDown
                  className={`w-4 h-4 transition-transform ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="px-6 pb-6 pt-0 border-t border-gray-100">
              {/* Row 1: Date filter + Start/End - medium width controls */}
              <div className="flex flex-wrap gap-4 items-center pt-4">
                {/* Date Filter - match Dashboard style with icon */}
                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Date Filter
                  </label>
                  <div className="flex gap-1 p-0.5 border border-gray-200 rounded-lg bg-gray-50/50">
                    {[
                      { id: "today", label: "Today" },
                      { id: "week", label: "Last 7 Days" },
                      { id: "month", label: "This Month" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDateRange(opt.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          dateRange === opt.id
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

                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Row 2: Country / Domain ID / Domain Name - medium width controls */}
              <div className="flex flex-wrap gap-4 items-center pt-3">
                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Select Country (Optional)
                  </label>
                  <select className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-56 text-gray-500">
                    <option>Name</option>
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Domain ID
                  </label>
                  <input
                    type="text"
                    placeholder="Search by domain id"
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-64"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    placeholder="Search by domain name"
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-64"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                )}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-2xl font-semibold text-gray-800 mt-1">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DATA TABLE (reusable component) ================= */}
        <div className="mb-6">
          <DataTableCard
            title="Report Data"
            columns={[
              { key: "date", label: "Date" },
              { key: "appId", label: "App ID" },
              { key: "site", label: "Site" },
              {
                key: "revenue",
                label: "Revenue",
                render: (row) => `$${row.revenue.toLocaleString()}`,
                cellClassName: "font-medium text-gray-800",
              },
              {
                key: "impression",
                label: "Impression",
                render: (row) => row.impression.toLocaleString(),
              },
              {
                key: "eCTR",
                label: "eCTR",
                render: (row) => `${row.eCTR.toFixed(1)}%`,
              },
              {
                key: "ctr",
                label: "CTR",
                render: (row) => `${row.ctr.toFixed(1)}%`,
              },
              {
                key: "adExchangeMatch",
                label: "Ad Exchange Match Rate",
                render: (row) => `${row.adExchangeMatch.toFixed(0)}%`,
              },
              {
                key: "totalFill",
                label: "Total Fill Rate",
                render: (row) => `${row.totalFill.toFixed(0)}%`,
              },
            ]}
            data={paginatedTableData}
            totalRow={
              <tr className="bg-gray-50 font-medium">
                <td className="px-4 py-3 text-gray-700">Total</td>
                <td className="px-4 py-3 text-gray-700">All App ID</td>
                <td className="px-4 py-3 text-gray-700">All Site</td>
                <td className="px-4 py-3 text-gray-800">
                  ${totals.revenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {totals.impression.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-700">{avgECTR.toFixed(1)}%</td>
                <td className="px-4 py-3 text-gray-700">{avgCTR.toFixed(1)}%</td>
                <td className="px-4 py-3 text-gray-700">
                  {avgAdExchangeMatch.toFixed(0)}%
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {avgTotalFill.toFixed(0)}%
                </td>
              </tr>
            }
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

        {/* ================= DAILY PERFORMANCE CHART (reusable component) ================= */}
        <LineChartCard
          data={chartData}
          title="Daily Performance"
          dataKey="earning"
          xAxisKey="date"
          valueLabel="Estimated Earning ($)"
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
    </div>
  );
}
