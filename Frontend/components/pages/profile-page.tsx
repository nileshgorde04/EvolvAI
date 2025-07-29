"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Edit3, Flame, Coins, BookOpen, Trophy, Star, Award, Target } from "lucide-react"
import { CountUpAnimation } from "@/components/ui/count-up"

const badges = [
  {
    id: 1,
    name: "7 Day Streak",
    icon: Flame,
    earned: true,
    description: "Logged for 7 consecutive days",
    color: "text-orange-400",
  },
  {
    id: 2,
    name: "First Journal",
    icon: BookOpen,
    earned: true,
    description: "Completed your first journal entry",
    color: "text-blue-400",
  },
  {
    id: 3,
    name: "30 Day Warrior",
    icon: Trophy,
    earned: false,
    description: "Log for 30 consecutive days",
    color: "text-yellow-400",
  },
  {
    id: 4,
    name: "Goal Crusher",
    icon: Target,
    earned: true,
    description: "Completed your first major goal",
    color: "text-green-400",
  },
  {
    id: 5,
    name: "Mood Master",
    icon: Star,
    earned: false,
    description: "Track mood for 14 consecutive days",
    color: "text-purple-400",
  },
  {
    id: 6,
    name: "Century Club",
    icon: Award,
    earned: false,
    description: "Complete 100 journal entries",
    color: "text-pink-400",
  },
]

export function ProfilePage() {
  const earnedBadges = badges.filter((badge) => badge.earned)
  const totalBadges = badges.length
  const currentLevel = 5
  const currentXP = 2340
  const nextLevelXP = 3000

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Profile & Rewards</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">John Doe</h3>
                  <p className="text-gray-400">john.doe@example.com</p>
                </div>

                <Button variant="outline" size="sm">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>

                <div className="w-full pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Bio</p>
                  <p className="text-white text-sm">
                    Aspiring DevOps engineer on a journey of continuous learning and growth. Passionate about
                    automation, cloud technologies, and personal development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Total Logs</span>
                </div>
                <span className="text-white font-semibold">
                  <CountUpAnimation end={47} duration={2} />
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-300">Current Streak</span>
                </div>
                <span className="text-orange-400 font-semibold">
                  <CountUpAnimation end={12} duration={2} /> days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300">Coins Earned</span>
                </div>
                <span className="text-yellow-400 font-semibold">
                  <CountUpAnimation end={1247} duration={2} />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress & Badges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">Level {currentLevel}</span>
                <span className="text-gray-400">
                  {currentXP} / {nextLevelXP} XP
                </span>
              </div>
              <Progress value={(currentXP / nextLevelXP) * 100} className="h-3" />
              <p className="text-sm text-gray-400">
                {nextLevelXP - currentXP} XP until Level {currentLevel + 1}
              </p>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Achievements
                </div>
                <Badge variant="outline" className="text-gray-400">
                  {earnedBadges.length} / {totalBadges}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all ${
                      badge.earned
                        ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30 pulse-glow"
                        : "bg-white/5 border-white/10 opacity-60"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${badge.earned ? "bg-yellow-500/20" : "bg-gray-500/20"}`}>
                        <badge.icon className={`h-5 w-5 ${badge.earned ? badge.color : "text-gray-500"}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${badge.earned ? "text-white" : "text-gray-400"}`}>
                          {badge.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                        {badge.earned && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="mt-2"
                          >
                            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Earned</Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
