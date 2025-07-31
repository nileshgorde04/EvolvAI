"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { format } from 'date-fns';

interface ProductivityChartProps {
  data: { log_date: string; productivity_score: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border-white/10 p-3 rounded-lg">
        <p className="text-white text-sm">{`${label}: ${payload[0].value}/10`}</p>
      </div>
    )
  }
  return null
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  const chartData = data.map(log => ({
      day: format(new Date(log.log_date), 'E'),
      score: log.productivity_score
  }));

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" fill="url(#productivityGradient)" radius={[4, 4, 0, 0]} />
          <defs>
            <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}