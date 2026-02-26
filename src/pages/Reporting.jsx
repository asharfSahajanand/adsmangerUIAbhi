import { useState } from "react";
import { FiFilter, FiDollarSign, FiTrendingUp, FiFileText, FiChevronDown } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
    { date: "22 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: "$1,530", impression: "12,450", eCTR: "2.1%", ctr: "1.8%", adExchangeMatch: "85%", totalFill: "92%" },
    { date: "22 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: "$1,830", impression: "14,200", eCTR: "2.3%", ctr: "2.0%", adExchangeMatch: "88%", totalFill: "94%" },
    { date: "21 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: "$2,529", impression: "18,900", eCTR: "2.5%", ctr: "2.2%", adExchangeMatch: "90%", totalFill: "96%" },
    { date: "21 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: "$1,209", impression: "9,800", eCTR: "1.9%", ctr: "1.6%", adExchangeMatch: "82%", totalFill: "89%" },
    { date: "20 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: "$1,650", impression: "13,100", eCTR: "2.2%", ctr: "1.9%", adExchangeMatch: "86%", totalFill: "93%" },
    { date: "20 Feb 2026", appId: "com/music/musicplayer", site: "Fmrxm.com", revenue: "$2,100", impression: "16,500", eCTR: "2.4%", ctr: "2.1%", adExchangeMatch: "87%", totalFill: "95%" },
  ];

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

        {/* ================= DATA TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">App ID</th>
                  <th className="px-4 py-3 text-left font-medium">Site</th>
                  <th className="px-4 py-3 text-left font-medium">Revenue</th>
                  <th className="px-4 py-3 text-left font-medium">Impression</th>
                  <th className="px-4 py-3 text-left font-medium">eCTR</th>
                  <th className="px-4 py-3 text-left font-medium">CTR</th>
                  <th className="px-4 py-3 text-left font-medium">Ad Exchange Match Rate</th>
                  <th className="px-4 py-3 text-left font-medium">Total Fill Rate</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{row.date}</td>
                    <td className="px-4 py-3 text-gray-700">{row.appId}</td>
                    <td className="px-4 py-3 text-gray-700">{row.site}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.revenue}</td>
                    <td className="px-4 py-3 text-gray-700">{row.impression}</td>
                    <td className="px-4 py-3 text-gray-700">{row.eCTR}</td>
                    <td className="px-4 py-3 text-gray-700">{row.ctr}</td>
                    <td className="px-4 py-3 text-gray-700">{row.adExchangeMatch}</td>
                    <td className="px-4 py-3 text-gray-700">{row.totalFill}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="px-4 py-3 text-gray-700">Total</td>
                  <td className="px-4 py-3 text-gray-700">All App ID</td>
                  <td className="px-4 py-3 text-gray-700">All Site</td>
                  <td className="px-4 py-3 text-gray-800">—</td>
                  <td className="px-4 py-3 text-gray-700">—</td>
                  <td className="px-4 py-3 text-gray-700">—</td>
                  <td className="px-4 py-3 text-gray-700">—</td>
                  <td className="px-4 py-3 text-gray-700">—</td>
                  <td className="px-4 py-3 text-gray-700">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`min-w-[2rem] px-2 py-1 rounded-lg text-sm ${currentPage === 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`min-w-[2rem] px-2 py-1 rounded-lg text-sm ${currentPage === 2 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`min-w-[2rem] px-2 py-1 rounded-lg text-sm ${currentPage === 3 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
              >
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button
                onClick={() => setCurrentPage(30)}
                className={`min-w-[2rem] px-2 py-1 rounded-lg text-sm ${currentPage === 30 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
              >
                30
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* ================= DAILY PERFORMANCE CHART ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700 text-lg">Daily Performance</h2>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
            >
              <option>Last 7 Days</option>
              <option>Last 14 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: "Estimated Earning ($)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value) => [`Daily Earning ($): ${value}`, "Estimated Earning ($)"]}
                  labelFormatter={(label) => label}
                />
                <Line
                  type="monotone"
                  dataKey="earning"
                  name="Estimated Earning ($)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="legend" defaultChecked className="rounded" />
            <label htmlFor="legend" className="text-sm text-gray-600">Estimated Earning ($)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
