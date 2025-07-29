"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Save, Sparkles, Brain, Heart, Zap } from "lucide-react"

const moodEmojis = [
  { emoji: "😢", label: "Very Sad", value: 1 },
  { emoji: "😔", label: "Sad", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😊", label: "Happy", value: 4 },
  { emoji: "😄", label: "Very Happy", value: 5 },
]

const emotionalTags = [
  "grateful",
  "anxious",
  "excited",
  "stressed",
  "calm",
  "motivated",
  "tired",
  "energetic",
  "focused",
  "distracted",
  "confident",
  "worried",
]

export function JournalPage() {
  const [journalText, setJournalText] = useState("")
  const [selectedMood, setSelectedMood] = useState(3)
  const [productivity, setProductivity] = useState([7])
  const [sleepHours, setSleepHours] = useState([8])
  const [waterIntake, setWaterIntake] = useState([6])
  const [screenTime, setScreenTime] = useState([4])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = () => {
    setShowAIAnalysis(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-6 w-6 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Today's Journal</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Journal Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">How was your day?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Start writing about your day..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                className="min-h-[300px] bg-transparent border-white/10 text-white placeholder:text-gray-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">Auto-saving...</p>
            </CardContent>
          </Card>

          {/* Emotional Tags */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-400" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {emotionalTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedTags.includes(tag) ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-white/10"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics Sidebar */}
        <div className="space-y-6">
          {/* Mood Selector */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                {moodEmojis.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`text-2xl p-2 rounded-full transition-all ${
                      selectedMood === mood.value ? "bg-purple-600/30 ring-2 ring-purple-400" : "hover:bg-white/10"
                    }`}
                  >
                    {mood.emoji}
                  </motion.button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-400">
                {moodEmojis.find((m) => m.value === selectedMood)?.label}
              </p>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Daily Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Productivity (1-10): {productivity[0]}</label>
                <Slider
                  value={productivity}
                  onValueChange={setProductivity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Sleep Hours: {sleepHours[0]}h</label>
                <Slider
                  value={sleepHours}
                  onValueChange={setSleepHours}
                  max={12}
                  min={4}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Water Intake: {waterIntake[0]} glasses</label>
                <Slider
                  value={waterIntake}
                  onValueChange={setWaterIntake}
                  max={12}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Screen Time: {screenTime[0]}h</label>
                <Slider
                  value={screenTime}
                  onValueChange={setScreenTime}
                  max={16}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save & Analyze
          </Button>
        </div>
      </div>

      {/* AI Analysis */}
      {showAIAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="mr-2 h-5 w-5 text-purple-400" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-2">Mood Analysis</h4>
                <p className="text-gray-300">
                  Your mood appears balanced today with hints of motivation and focus. The combination of gratitude and
                  energy suggests a positive mindset.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-2">Positive Reinforcement</h4>
                <p className="text-gray-300">
                  Great job maintaining high productivity while getting adequate sleep! This balance is key to
                  sustainable growth.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                  <Zap className="mr-1 h-4 w-4" />
                  Recommended Habit
                </h4>
                <p className="text-gray-300">
                  Consider adding a 10-minute morning meditation to enhance your already positive mindset and boost
                  focus for the day ahead.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
