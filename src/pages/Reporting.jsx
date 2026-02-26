import { useState } from "react";
import { FiFilter, FiDollarSign, FiTrendingUp, FiFileText, FiChevronDown } from "react-icons/fi";
import LineChartCard from "../components/LineChartCard";
import DataTableCard from "../components/DataTableCard";

export default function Reporting() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dateRange, setDateRange] = useState("month"); // today | week | month
  const [startDate, setStartDate] = useState("03-01-2025");
  const [endDate, setEndDate] = useState("05-03-2025");
  const [chartRange, setChartRange] = useState("Last 7 Days");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 33;

  const summaryCards = [
    { title: "Total Revenue", value: "$74.79", icon: FiDollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total App & Website Domain", value: "390", icon: FiTrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { title: "Impacted Records", value: "173", icon: FiFileText, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  const tableData = [
    { date: "22 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: 1530, impression: 12450, eCTR: 2.1, ctr: 1.8, adExchangeMatch: 85, totalFill: 92 },
    { date: "22 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: 1830, impression: 14200, eCTR: 2.3, ctr: 2.0, adExchangeMatch: 88, totalFill: 94 },
    { date: "21 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: 2529, impression: 18900, eCTR: 2.5, ctr: 2.2, adExchangeMatch: 90, totalFill: 96 },
    { date: "21 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: 1209, impression: 9800, eCTR: 1.9, ctr: 1.6, adExchangeMatch: 82, totalFill: 89 },
    { date: "20 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: 1650, impression: 13100, eCTR: 2.2, ctr: 1.9, adExchangeMatch: 86, totalFill: 93 },
    { date: "20 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: 2100, impression: 16500, eCTR: 2.4, ctr: 2.1, adExchangeMatch: 87, totalFill: 95 },
  ];

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
    <div className="bg-[#f4f6fb] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reporting</h1>
            <p className="text-gray-500 text-sm mt-1">
              Offers real-time data & insights for ad campaigns
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700">
              Generate Report
            </button>
            <button className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-green-700">
              Download CSV
            </button>
            <button className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-300 flex items-center gap-1">
              Boost <FiChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= FILTER OPTION ================= */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50"
          >
            <h2 className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FiFilter /> Filter Option
            </h2>
            <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
          {filterOpen && (
            <div className="px-6 pb-6 pt-0 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 items-end pt-4">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "today", label: "Today" },
                    { id: "week", label: "Last 7 Days" },
                    { id: "month", label: "This Month" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDateRange(opt.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        dateRange === opt.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Select Country (Optional)</label>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 text-gray-500">
                      <option>Name</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Domain ID</label>
                    <input
                      type="text"
                      placeholder="Search by domain id"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-44"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Domain Name</label>
                    <input
                      type="text"
                      placeholder="Search by domain name"
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-44"
                    />
                  </div>
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
                <card.icon className={`w-6 h-6 ${card.color}`} />
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
            data={tableData}
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
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
              pageNumbers: [1, 2, 3, 30],
            }}
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
