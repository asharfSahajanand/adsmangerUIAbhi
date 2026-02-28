import { useMemo, useState, useEffect } from "react";
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
import { useDataByUserDomains } from "../hooks/useDataByUserDomains";

// Parse "1 Jan 2026" → "2026-01-01" for comparison
function dateStrToYMD(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayYMD() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export default function Reporting() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [dateRange, setDateRange] = useState("month"); // today | week | month
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-02-29");
  const [chartRange, setChartRange] = useState("Last 7 Days");
  const [currentPage, setCurrentPage] = useState(1);
  const [domainId, setDomainId] = useState("");
  const [domainName, setDomainName] = useState("");
  const [reportMessage, setReportMessage] = useState(null);

  const tableData = useDataByUserDomains(reportingData.tableData || [], "site");
  const todayYMD = getTodayYMD();

  // Dynamic filtered data: date filter first, then Domain ID and Domain Name (optional)
  const filteredTableData = useMemo(() => {
    let dateFiltered;
    const hasCustomRange = startDate && endDate && startDate <= endDate;
    if (hasCustomRange) {
      dateFiltered = tableData.filter((row) => {
        const ymd = dateStrToYMD(row.date);
        return ymd && ymd >= startDate && ymd <= endDate;
      });
    } else if (dateRange === "today") {
      dateFiltered = tableData.filter((row) => dateStrToYMD(row.date) === todayYMD);
    } else if (dateRange === "week") {
      const start = new Date(todayYMD);
      start.setDate(start.getDate() - 6);
      const weekStart = start.toISOString().slice(0, 10);
      dateFiltered = tableData.filter((row) => {
        const ymd = dateStrToYMD(row.date);
        return ymd && ymd >= weekStart && ymd <= todayYMD;
      });
    } else {
      const [y, m] = todayYMD.split("-");
      const monthStart = `${y}-${m}-01`;
      const endOfMonth = new Date(Number(y), Number(m), 0);
      const monthEndStr = `${y}-${String(endOfMonth.getMonth() + 1).padStart(2, "0")}-${String(endOfMonth.getDate()).padStart(2, "0")}`;
      dateFiltered = tableData.filter((row) => {
        const ymd = dateStrToYMD(row.date);
        return ymd && ymd >= monthStart && ymd <= monthEndStr;
      });
    }
    const idTrim = (domainId || "").trim().toLowerCase();
    const nameTrim = (domainName || "").trim().toLowerCase();
    if (!idTrim && !nameTrim) return dateFiltered;
    return dateFiltered.filter((row) => {
      const matchId = !idTrim || (row.appId || "").toLowerCase().includes(idTrim);
      const matchName = !nameTrim || (row.site || "").toLowerCase().includes(nameTrim);
      return matchId && matchName;
    });
  }, [tableData, dateRange, startDate, endDate, todayYMD, domainId, domainName]);

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, startDate, endDate, domainId, domainName]);

  const handleGenerateReport = () => {
    setReportMessage("Report generated with current filters.");
    setTimeout(() => setReportMessage(null), 3000);
  };

  const handleDownloadCSV = () => {
    const headers = ["Date", "App ID", "Site", "Revenue", "Impression", "eCTR", "CTR", "Ad Exchange Match", "Total Fill"];
    const rows = filteredTableData.map((row) => [
      row.date,
      row.appId,
      row.site,
      row.revenue,
      row.impression,
      row.eCTR,
      row.ctr,
      row.adExchangeMatch,
      row.totalFill,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setReportMessage("CSV downloaded.");
    setTimeout(() => setReportMessage(null), 2000);
  };

  // Dynamic summary cards from filtered data
  const summaryCards = useMemo(() => {
    const revenue = filteredTableData.reduce((s, r) => s + r.revenue, 0);
    const uniqueSites = new Set(filteredTableData.map((r) => r.site)).size;
    const records = filteredTableData.length;
    const base = reportingData.summaryCards;
    return [
      { ...base[0], value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: FiDollarSign },
      { ...base[1], value: String(uniqueSites), icon: FiTrendingUp },
      { ...base[2], value: String(records), icon: FiFileText },
    ];
  }, [filteredTableData]);

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

  const totals = useMemo(
    () =>
      filteredTableData.reduce(
        (acc, row) => ({
          revenue: acc.revenue + row.revenue,
          impression: acc.impression + row.impression,
          eCTR: acc.eCTR + row.eCTR,
          ctr: acc.ctr + row.ctr,
          adExchangeMatch: acc.adExchangeMatch + row.adExchangeMatch,
          totalFill: acc.totalFill + row.totalFill,
        }),
        { revenue: 0, impression: 0, eCTR: 0, ctr: 0, adExchangeMatch: 0, totalFill: 0 }
      ),
    [filteredTableData]
  );

  const rowCount = filteredTableData.length;
  const avgECTR = rowCount ? totals.eCTR / rowCount : 0;
  const avgCTR = rowCount ? totals.ctr / rowCount : 0;
  const avgAdExchangeMatch = rowCount ? totals.adExchangeMatch / rowCount : 0;
  const avgTotalFill = rowCount ? totals.totalFill / rowCount : 0;

  // Chart data from filtered table: group by date, sum revenue
  const chartData = useMemo(() => {
    const byDate = {};
    filteredTableData.forEach((row) => {
      const d = row.date;
      if (!byDate[d]) byDate[d] = { date: d, earning: 0 };
      byDate[d].earning += row.revenue;
    });
    return Object.values(byDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [filteredTableData]);

  // Chart range: limit points shown (Last 7 / Last 14 / all filtered)
  const chartDataDisplay = useMemo(() => {
    if (chartRange === "Last 7 Days") return chartData.slice(-7);
    if (chartRange === "Last 14 Days") return chartData.slice(-14);
    return chartData;
  }, [chartData, chartRange]);

  return (
    <div className="bg-[#f4f6fb] min-h-screen px-3 py-4 sm:px-6 sm:py-6 min-w-0">
      <div className="max-w-7xl mx-auto min-w-0">
        {/* ================= HEADER ================= */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Reporting</h1>
          <p className="text-gray-500 text-sm mt-1">
            Offers real-time and historical reporting for ad campaigns
          </p>
        </div>

        {/* ================= FILTER OPTION ================= */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 sm:mb-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2 text-lg">
              <FiFilter /> Filter Option
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {reportMessage && (
                <span className="text-sm text-green-600 font-medium animate-pulse mr-1">
                  {reportMessage}
                </span>
              )}
              <button
                type="button"
                onClick={handleGenerateReport}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
              >
                Generate Report
              </button>
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 whitespace-nowrap"
              >
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateRange("month");
                  setStartDate("2026-01-01");
                  setEndDate("2026-02-29");
                  setDomainId("");
                  setDomainName("");
                }}
                className="bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 whitespace-nowrap"
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
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-gray-100">
              {/* Row 1: Date filter + Start/End - medium width controls */}
              <div className="flex flex-wrap gap-4 items-center pt-4">
                {/* Date Filter - match Dashboard style with icon */}
                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Date Filter
                  </label>
                  <div className="flex flex-wrap gap-1 p-0.5 border border-gray-200 rounded-lg bg-gray-50/50">
                    {[
                      { id: "today", label: "Today" },
                      { id: "week", label: "Last 7 Days" },
                      { id: "month", label: "This Month" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setDateRange(opt.id);
                          setStartDate("");
                          setEndDate("");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          dateRange === opt.id
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
                    value={domainId}
                    onChange={(e) => setDomainId(e.target.value)}
                    placeholder="Search by domain id"
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <label className="block text-xs text-gray-500 mb-1">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="Search by domain name"
                    className="border border-gray-200 rounded-full px-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm flex items-center gap-4 min-w-0">
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
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-1 truncate">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DATA TABLE (reusable component) ================= */}
        <div className="mb-6 overflow-hidden">
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
          data={chartDataDisplay}
          title="Daily Performance"
          dataKey="earning"
          xAxisKey="date"
          valueLabel="Estimated Earning ($)"
          showLegend
          height={280}
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
    </div>
  );
}
