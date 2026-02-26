/**
 * Reusable table card: white card with title, optional right header, table, optional total row, optional pagination.
 *
 * @param {Object} props
 * @param {string} props.title - Card title (e.g. "Detailed Report")
 * @param {React.ReactNode} [props.rightHeader] - Optional node on the right of title (e.g. "Add Filter" button)
 * @param {{ key: string, label: string, render?: (row: object) => React.ReactNode, cellClassName?: string }[]} props.columns - Column definitions; render optional for custom cell; cellClassName optional for td class
 * @param {object[]} props.data - Array of row objects
 * @param {React.ReactNode} [props.totalRow] - Optional <tr> element for totals row
 * @param {{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }} [props.pagination] - Optional pagination config
 */
export default function DataTableCard({
  title,
  rightHeader,
  columns,
  data,
  totalRow,
  pagination,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {(title || rightHeader) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="font-semibold text-gray-700 text-lg">{title}</h2>}
          {rightHeader}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium">
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
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
                {page}
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
      )}
    </div>
  );
}
