import { FiSearch } from "react-icons/fi";

/**
 * Reusable table card: white card with title, optional right header, table, optional total row, optional pagination.
 *
 * @param {Object} props
 * @param {string} props.title - Card title (e.g. "Detailed Report")
 * @param {React.ReactNode} [props.rightHeader] - Optional node on the right of toolbar row (e.g. buttons)
 * @param {{ key: string, label: string, render?: (row: object) => React.ReactNode, cellClassName?: string }[]} props.columns - Column definitions; render optional for custom cell; cellClassName optional for td class
 * @param {object[]} props.data - Array of row objects
 * @param {React.ReactNode} [props.totalRow] - Optional <tr> element for totals row
 * @param {{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }} [props.pagination] - Optional pagination config
 * @param {string} [props.searchPlaceholder] - Optional search input placeholder; when provided, a search box is shown above the table
 * @param {string} [props.searchValue] - Current search value (controlled)
 * @param {(value: string) => void} [props.onSearchChange] - Callback when search input changes
 */
export default function DataTableCard({
  title,
  rightHeader,
  columns,
  data,
  totalRow,
  pagination,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {(title || rightHeader || searchPlaceholder) && (
        <div className="mb-4 space-y-3">
          {title && <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>}
          {(searchPlaceholder || rightHeader) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {searchPlaceholder && (
                <div className="relative w-full max-w-xs">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchValue ?? ""}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full border border-gray-200 rounded-full pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              {rightHeader}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3.5 text-left font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${col.cellClassName ?? "text-gray-700"}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {totalRow}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-500">
              Page {String(pagination.currentPage).padStart(2, "0")} Page of{" "}
              {String(pagination.totalPages).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              {pagination.pageNumbers?.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => pagination.onPageChange(page)}
                  className={`min-w-[2rem] px-2 py-1 rounded-lg text-sm ${
                    pagination.currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {String(page).padStart(2, "0")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
