import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


export default function LineChartCard({
  data,
  title = "Daily Performance",
  subtitle,
  dataKey = "revenue",
  xAxisKey = "day",
  valueLabel,
  rightHeader,
  showLegend = false,
  height = 320,
  strokeColor = "#3b82f6",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700 text-lg">{title}</h2>
        <div className="flex items-center gap-2">
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
          {rightHeader}
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              {...(valueLabel
                ? { label: { value: valueLabel, angle: -90, position: "insideLeft" } }
                : {})}
            />
            <Tooltip
              {...(valueLabel
                ? {
                    formatter: (value) => [`${valueLabel}: ${value}`, valueLabel],
                    labelFormatter: (label) => label,
                  }
                : {})}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={valueLabel || dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="chart-legend" defaultChecked className="rounded" />
          <label htmlFor="chart-legend" className="text-sm text-gray-600">
            {valueLabel || dataKey}
          </label>
        </div>
      )}
    </div>
  );
}
