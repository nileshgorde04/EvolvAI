"use client"

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

const data = [
  { subject: "Sleep", value: 85, fullMark: 100 },
  { subject: "Exercise", value: 70, fullMark: 100 },
  { subject: "Nutrition", value: 78, fullMark: 100 },
  { subject: "Focus", value: 82, fullMark: 100 },
  { subject: "Mood", value: 88, fullMark: 100 },
  { subject: "Energy", value: 75, fullMark: 100 },
]

export function WellnessRadarChart() {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Wellness" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
