import { useState } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
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
  // Controls whether the numeric values are drawn on top of each point
  const [showValues, setShowValues] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold text-gray-700 text-lg">{title}</h2>
        <div className="flex items-center gap-2">
          {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
          {rightHeader}
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area type="monotone" dataKey={dataKey} stroke="none" fill="url(#chartGradient)" />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={valueLabel || dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            >
              {showValues && (
                <LabelList
                  dataKey={dataKey}
                  position="top"
                  formatter={(val) =>
                    typeof val === "number" ? val.toFixed(2) : val
                  }
                  className="text-[10px] fill-gray-700"
                />
              )}
            </Line>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <input
            type="checkbox"
            id="chart-legend"
            checked={showValues}
            onChange={(e) => setShowValues(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="chart-legend" className="text-sm text-gray-600">
            {valueLabel || dataKey}
          </label>
        </div>
      )}
    </div>
  );
}
