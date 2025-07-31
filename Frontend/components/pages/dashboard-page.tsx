"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Flame, Target, Coins, PenTool, Sparkles, Activity, Brain, Loader2 } from "lucide-react"
import { MoodChart } from "@/components/charts/mood-chart"
import { ProductivityChart } from "@/components/charts/productivity-chart"
import { WellnessRadarChart } from "@/components/charts/radar-chart"
import { HabitCalendar } from "@/components/charts/habit-calendar"
import { CountUpAnimation } from "@/components/ui/count-up"
import Link from "next/link"
import { toast } from "sonner"

// --- Types ---
interface Log { log_date: string; mood: number; productivity_score: number; }
interface Goal { title: string; progress: number; tasksCompleted: number; totalTasks: number; }
interface DashboardData {
  userName: string;
  recentLogs: Log[];
  coinsEarned: number;
  allLogs: { log_date: string }[];
  mainGoal: Goal | null;
  currentStreak: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setIsLoading(false); return; }
      try {
        const response = await fetch('http://localhost:8080/api/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard data.");
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        toast.error("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-10 w-10 animate-spin text-purple-400" /></div>;
  }

  if (!data) {
     return (
        <div className="text-center">
             <h1 className="text-2xl font-bold text-white mb-4">Welcome to EvolvAI!</h1>
             <p className="text-gray-400 mb-6">Log your first journal entry to unlock your personalized dashboard.</p>
             <Link href="/journal">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <PenTool className="mr-2 h-5 w-5" />
                    Write Your First Journal
                </Button>
            </Link>
        </div>
    );
  }

  const avgMood = data.recentLogs.length > 0 ? (data.recentLogs.reduce((acc, log) => acc + log.mood, 0) / data.recentLogs.length).toFixed(1) : "N/A";
  const avgProductivity = data.recentLogs.length > 0 ? (data.recentLogs.reduce((acc, log) => acc + log.productivity_score, 0) / data.recentLogs.length).toFixed(1) : "N/A";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Welcome back, {data.userName}!</h1>
        </div>
        <p className="text-lg text-gray-300 italic">"The secret of getting ahead is getting started." - Mark Twain</p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/journal"><Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"><PenTool className="mr-2 h-5 w-5" />Write Today's Journal</Button></Link>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 hover:border-orange-500/30 transition-all duration-300 pulse-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-400">
                    <CountUpAnimation end={data.currentStreak} />
                    <span className="text-sm ml-1">days</span>
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-400 floating-animation" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-400">Coins Earned</p><p className="text-2xl font-bold text-yellow-400"><CountUpAnimation end={data.coinsEarned} /></p></div><Coins className="h-8 w-8 text-yellow-400 floating-animation" /></div></CardContent></Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-400">Avg Mood (7d)</p><p className="text-2xl font-bold text-green-400">{avgMood}/5</p></div><Brain className="h-8 w-8 text-green-400" /></div></CardContent></Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-400">Avg Prod. (7d)</p><p className="text-2xl font-bold text-blue-400">{avgProductivity}/10</p></div><Activity className="h-8 w-8 text-blue-400" /></div></CardContent></Card>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardHeader><CardTitle className="text-lg font-medium text-white">Mood Trend</CardTitle></CardHeader><CardContent><MoodChart data={data.recentLogs} /></CardContent></Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardHeader><CardTitle className="text-lg font-medium text-white">Productivity Score</CardTitle></CardHeader><CardContent><ProductivityChart data={data.recentLogs} /></CardContent></Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardHeader><CardTitle className="text-lg font-medium text-white">Wellness Overview</CardTitle></CardHeader><CardContent><WellnessRadarChart /></CardContent></Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10"><CardHeader><CardTitle className="text-lg font-medium text-white">Habit Tracker</CardTitle></CardHeader><CardContent><HabitCalendar logs={data.allLogs} /></CardContent></Card>
        </motion.div>
      </motion.div>

      {data.mainGoal && (
          <motion.div variants={itemVariants}>
            <Card className="glass-card border-white/10">
              <CardHeader><CardTitle className="text-lg font-medium text-white">Main Goal Progress</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-xl font-medium text-white">{data.mainGoal.title}</span><span className="text-lg text-purple-400 font-semibold">{data.mainGoal.progress}%</span></div>
                <Progress value={data.mainGoal.progress} className="h-3" />
                <div className="flex justify-between text-sm text-gray-400"><span>{data.mainGoal.tasksCompleted} of {data.mainGoal.totalTasks} tasks completed</span></div>
                <Link href="/goals"><Button variant="outline" size="sm" className="mt-2 bg-transparent">View Details</Button></Link>
              </CardContent>
            </Card>
          </motion.div>
      )}
    </motion.div>
  )
}