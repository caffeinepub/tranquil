import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StressLevel } from "../backend";
import type { DailyStressData } from "../utils/stressAnalytics";

interface StressChartProps {
  data: DailyStressData[];
}

const LEVEL_COLORS = {
  [StressLevel.low]: "#4ade80",
  [StressLevel.medium]: "#a78bfa",
  [StressLevel.high]: "#f87171",
};

export function StressChart({ data }: StressChartProps) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.88 0.02 220 / 0.5)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "oklch(0.52 0.04 250)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "oklch(0.52 0.04 250)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.99 0.004 220)",
              border: "1px solid oklch(0.88 0.02 220)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value}`, "Stress Score"]}
          />
          <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.day}`}
                fill={
                  entry.count > 0
                    ? LEVEL_COLORS[entry.level]
                    : "oklch(0.88 0.02 220)"
                }
                opacity={entry.count > 0 ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-3">
        {[
          { level: StressLevel.low, label: "Low", color: "#4ade80" },
          { level: StressLevel.medium, label: "Medium", color: "#a78bfa" },
          { level: StressLevel.high, label: "High", color: "#f87171" },
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
