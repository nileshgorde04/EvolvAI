"use client"

import { Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"

const data = [
  { day: "Mon", mood: 3.5, date: "Dec 18" },
  { day: "Tue", mood: 4.2, date: "Dec 19" },
  { day: "Wed", mood: 3.8, date: "Dec 20" },
  { day: "Thu", mood: 4.5, date: "Dec 21" },
  { day: "Fri", mood: 4.1, date: "Dec 22" },
  { day: "Sat", mood: 4.8, date: "Dec 23" },
  { day: "Sun", mood: 4.3, date: "Dec 24" },
]

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

export function MoodChart() {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, fill: "#A855F7", stroke: "#8B5CF6", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
