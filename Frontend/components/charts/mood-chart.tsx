"use client"

import { Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"
import { format } from 'date-fns';

interface MoodChartProps {
  data: { log_date: string; mood: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const moodEmojis = ["😢", "😔", "😐", "😊", "😄"]
    const moodValue = payload[0].value
    const emoji = moodEmojis[Math.floor(moodValue) - 1] || "😐"

    return (
      <div className="glass-card border-white/10 p-3 rounded-lg">
        <p className="text-white text-sm">{`${label}: ${moodValue}/5 ${emoji}`}</p>
      </div>
    )
  }
  return null
}

export function MoodChart({ data }: MoodChartProps) {
  const chartData = data.map(log => ({
    day: format(new Date(log.log_date), 'E'), // Format date to 'Mon', 'Tue', etc.
    mood: log.mood
  }));

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
          <YAxis hide domain={[1, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={3} fill="url(#moodGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}