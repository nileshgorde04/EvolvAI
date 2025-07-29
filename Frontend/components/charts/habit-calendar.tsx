"use client"

import { motion } from "framer-motion"

const generateCalendarData = () => {
  const days = []
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

  for (let i = 1; i <= daysInMonth; i++) {
    const hasEntry = Math.random() > 0.3 // 70% chance of having an entry
    const intensity = hasEntry ? Math.floor(Math.random() * 4) + 1 : 0
    days.push({
      day: i,
      hasEntry,
      intensity,
      isToday: i === today.getDate(),
    })
  }

  return days
}

export function HabitCalendar() {
  const calendarData = generateCalendarData()

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1:
        return "bg-green-900/40"
      case 2:
        return "bg-green-700/60"
      case 3:
        return "bg-green-500/80"
      case 4:
        return "bg-green-400"
      default:
        return "bg-gray-800/50"
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-xs text-gray-400 text-center p-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.02 }}
            className={`
              w-6 h-6 rounded-sm flex items-center justify-center text-xs font-medium
              ${getIntensityColor(day.intensity)}
              ${day.isToday ? "ring-2 ring-purple-400" : ""}
              ${day.hasEntry ? "text-white" : "text-gray-500"}
            `}
          >
            {day.day}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div key={intensity} className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
