"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Flame, Target, Coins, PenTool, Sparkles, Activity, Brain } from "lucide-react"
import { MoodChart } from "@/components/charts/mood-chart"
import { ProductivityChart } from "@/components/charts/productivity-chart"
import { WellnessRadarChart } from "@/components/charts/radar-chart"
import { HabitCalendar } from "@/components/charts/habit-calendar"
import { CountUpAnimation } from "@/components/ui/count-up"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    },
  },
}

export function DashboardPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Welcome back, John!</h1>
        </div>
        <p className="text-lg text-gray-300 italic">
          "The only way to do great work is to love what you do." - Steve Jobs
        </p>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/journal">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <PenTool className="mr-2 h-5 w-5" />
              Write Today's Journal
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-orange-500/30 transition-all duration-300 pulse-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-400">
                    <CountUpAnimation end={12} duration={2} />
                    <span className="text-sm ml-1">days</span>
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-400 floating-animation" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-yellow-500/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Coins Earned</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    <CountUpAnimation end={1247} duration={2} />
                  </p>
                </div>
                <Coins className="h-8 w-8 text-yellow-400 floating-animation" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Mood</p>
                  <p className="text-2xl font-bold text-green-400">4.2/5</p>
                </div>
                <Brain className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Productivity</p>
                  <p className="text-2xl font-bold text-blue-400">7.8/10</p>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Charts Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Mood Trend</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <MoodChart />
              <p className="text-xs text-gray-400 mt-2">Last 7 days • Trending upward 📈</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Productivity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Productivity Score</CardTitle>
              <Activity className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <ProductivityChart />
              <p className="text-xs text-gray-400 mt-2">Last 7 days • Average: 7.8/10</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wellness Radar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-green-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Wellness Overview</CardTitle>
              <Brain className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <WellnessRadarChart />
              <p className="text-xs text-gray-400 mt-2">Current week snapshot</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Habit Calendar */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-orange-500/30 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium text-white">Habit Tracker</CardTitle>
              <Calendar className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <HabitCalendar />
              <p className="text-xs text-gray-400 mt-2">This month • 23/30 days completed</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Goal Progress */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-white/10 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">Main Goal Progress</CardTitle>
            <Target className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-white">Become DevOps Engineer</span>
              <span className="text-lg text-purple-400 font-semibold">67%</span>
            </div>
            <Progress value={67} className="h-3" />
            <div className="flex justify-between text-sm text-gray-400">
              <span>4 of 6 tasks completed</span>
              <span>🔥 Great progress!</span>
            </div>
            <Link href="/goals">
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                View Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
