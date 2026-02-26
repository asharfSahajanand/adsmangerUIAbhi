import { useState } from "react";
import { FiFilter, FiCheck, FiRefreshCw, FiChevronUp, FiChevronDown, FiCalendar } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dateFilter, setDateFilter] = useState("month"); // today | week | month
  const [startDate, setStartDate] = useState("22-01-2026");
  const [endDate, setEndDate] = useState("20-02-2026");
  const [domain, setDomain] = useState("");

  // ✅ Dynamic Stats
  const [stats] = useState([
    { title: "Total Earnings", value: 2.29, change: 3 },
    { title: "Today Revenue", value: 0.29, change: 1 },
    { title: "Yesterday Revenue", value: 0.29, change: -2 },
    { title: "Page Views", value: 338, change: 4 },
    { title: "Impressions", value: 564, change: 6 },
    { title: "Clicks", value: 95, change: -1 },
  ]);

  // ✅ Dynamic Chart Data
  const [chartData] = useState([
    { day: "Feb 1", revenue: 0.10 },
    { day: "Feb 2", revenue: 0.15 },
    { day: "Feb 3", revenue: 0.12 },
    { day: "Feb 4", revenue: 0.18 },
    { day: "Feb 5", revenue: 0.40 },
    { day: "Feb 6", revenue: 0.22 },
    { day: "Feb 7", revenue: 0.30 },
  ]);

  // ✅ Dynamic Table Data
  const [tableData] = useState([
    { date: "Feb 1, 2025", revenue: 0.29, impressions: 1200, clicks: 34 },
    { date: "Feb 2, 2025", revenue: 0.35, impressions: 1500, clicks: 40 },
    { date: "Feb 3, 2025", revenue: 0.18, impressions: 900, clicks: 22 },
    { date: "Feb 4, 2025", revenue: 0.42, impressions: 1800, clicks: 50 },
  ]);

  return (
    <div className="bg-[#f4f6fb] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* ================= FILTER ================= */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
              <span className="text-blue-600">
                <FiFilter className="w-5 h-5" />
              </span>
              Filter Option
            </h2>
            <div className="flex items-center gap-2">
              <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
                <FiCheck className="w-4 h-4" /> Apply Filter
              </button>
              <button
                onClick={() => {
                  setDateFilter("month");
                  setStartDate("22-01-2026");
                  setEndDate("20-02-2026");
                  setDomain("");
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Domain List</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="Select your domain"
                      className="border border-gray-200 rounded-lg pl-3 pr-9 py-2.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
                  </div>
                </div>
                <div>
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
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-200 rounded-lg pl-3 pr-9 py-2.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-200 rounded-lg pl-3 pr-9 py-2.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
              <p className="text-gray-500 text-sm">{item.title}</p>
              <div className="flex justify-between items-center mt-3">
                <h3 className="text-2xl font-semibold">
                  {typeof item.value === "number" && item.title.includes("Revenue") || item.title.includes("Earnings")
                    ? `$${item.value}`
                    : item.value}
                </h3>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    item.change < 0
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CHART ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-gray-700 text-lg">
              Daily Performance
            </h2>
            <span className="text-sm text-gray-500">Last 7 Days</span>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-gray-700 text-lg">
              Detailed Report
            </h2>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              <AiOutlinePlus /> Add Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Revenue</th>
                  <th className="px-4 py-3 text-left">Impressions</th>
                  <th className="px-4 py-3 text-left">Clicks</th>
                  <th className="px-4 py-3 text-left">CTR</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => {
                  const ctr = ((row.clicks / row.impressions) * 100).toFixed(2);
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{row.date}</td>
                      <td className="px-4 py-3 font-medium">
                        ${row.revenue}
                      </td>
                      <td className="px-4 py-3">{row.impressions}</td>
                      <td className="px-4 py-3">{row.clicks}</td>
                      <td className="px-4 py-3">{ctr}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}