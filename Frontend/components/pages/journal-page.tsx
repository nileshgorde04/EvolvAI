"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Save, Sparkles, Brain, Heart, Zap, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AIAnalysis { moodAnalysis: string; positiveReinforcement: string; gentleSuggestion: string; }
const moodEmojis = [ { emoji: "😢", label: "Very Sad", value: 1 }, { emoji: "😔", label: "Sad", value: 2 }, { emoji: "😐", label: "Neutral", value: 3 }, { emoji: "😊", label: "Happy", value: 4 }, { emoji: "😄", label: "Very Happy", value: 5 }, ];
const emotionalTags = [ "grateful", "anxious", "excited", "stressed", "calm", "motivated", "tired", "energetic", "focused", "distracted", "confident", "worried", ];
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export function JournalPage() {
  const [journalText, setJournalText] = useState("")
  const [selectedMood, setSelectedMood] = useState(3)
  const [productivity, setProductivity] = useState([7])
  const [sleepHours, setSleepHours] = useState([8])
  const [waterIntake, setWaterIntake] = useState([6])
  const [screenTime, setScreenTime] = useState([4])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (tag: string) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleSubmit = async () => {
    setIsLoading(true);
    setAiAnalysis(null);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication Error", { description: "You must be logged in." });
      setIsLoading(false);
      return;
    }
    const logData = { log_date: getTodayDateString(), content: journalText, mood: selectedMood, productivity_score: productivity[0], sleep_hours: sleepHours[0], water_intake: waterIntake[0], screen_time_hours: screenTime[0], emotional_tags: selectedTags };

    try {
      const saveResponse = await fetch('http://localhost:8080/api/logs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(logData) });
      if (!saveResponse.ok) throw new Error("Failed to save journal entry.");
      toast.success("Journal entry saved!");
      toast.info("Getting your personalized analysis...");

      const analyzeResponse = await fetch('http://localhost:8080/api/logs/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(logData) });
      if (!analyzeResponse.ok) throw new Error("AI analysis is currently busy.");

      const analysisData = await analyzeResponse.json();
      setAiAnalysis(analysisData.analysis);
    } catch (error: any) {
      toast.info("Just a moment...", {
        description: "Our AI is carefully reading your entry to give you the best insights. If it takes too long, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2"><Sparkles className="h-6 w-6 text-purple-400" /><h1 className="text-3xl font-bold text-white">Today's Journal</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white">How was your day?</CardTitle></CardHeader>
            <CardContent><Textarea placeholder="Share anything on your mind..." value={journalText} onChange={(e) => setJournalText(e.target.value)} className="min-h-[300px] bg-transparent border-white/10 text-white" /></CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white flex items-center"><Heart className="mr-2 h-5 w-5 text-red-400" />How are you feeling?</CardTitle></CardHeader>
            <CardContent><div className="flex flex-wrap gap-2">{emotionalTags.map((tag) => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-purple-600" : ""}`} onClick={() => toggleTag(tag)}>{tag}</Badge>)}</div></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white">Mood</CardTitle></CardHeader>
            <CardContent><div className="flex justify-between mb-4">{moodEmojis.map((mood) => <motion.button key={mood.value} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedMood(mood.value)} className={`text-2xl p-2 rounded-full ${selectedMood === mood.value ? "bg-purple-600/30 ring-2 ring-purple-400" : ""}`}>{mood.emoji}</motion.button>)}</div><p className="text-center text-sm text-gray-400">{moodEmojis.find((m) => m.value === selectedMood)?.label}</p></CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white">Daily Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div><label className="text-sm text-gray-300 mb-2 block">Productivity (1-10): {productivity[0]}</label><Slider value={productivity} onValueChange={setProductivity} max={10} min={1} step={1} /></div>
              <div><label className="text-sm text-gray-300 mb-2 block">Sleep Hours: {sleepHours[0]}h</label><Slider value={sleepHours} onValueChange={setSleepHours} max={12} min={4} step={0.5} /></div>
              <div><label className="text-sm text-gray-300 mb-2 block">Water Intake: {waterIntake[0]} glasses</label><Slider value={waterIntake} onValueChange={setWaterIntake} max={12} min={0} step={1} /></div>
              <div><label className="text-sm text-gray-300 mb-2 block">Screen Time: {screenTime[0]}h</label><Slider value={screenTime} onValueChange={setScreenTime} max={16} min={0} step={0.5} /></div>
            </CardContent>
          </Card>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save & Analyze</>}</Button>
        </div>
      </div>
      {aiAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card border-purple-500/30">
            <CardHeader><CardTitle className="text-white flex items-center"><Brain className="mr-2 h-5 w-5 text-purple-400" />Your AI Companion's Thoughts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-green-900/20 border-green-500/30"><h4 className="font-semibold text-green-400 mb-2">Mood Analysis</h4><p className="text-gray-300">{aiAnalysis.moodAnalysis}</p></div>
              <div className="p-4 rounded-lg bg-blue-900/20 border-blue-500/30"><h4 className="font-semibold text-blue-400 mb-2">Positive Reinforcement</h4><p className="text-gray-300">{aiAnalysis.positiveReinforcement}</p></div>
              <div className="p-4 rounded-lg bg-yellow-900/20 border-yellow-500/30"><h4 className="font-semibold text-yellow-400 mb-2 flex items-center"><Zap className="mr-1 h-4 w-4" />A Gentle Suggestion</h4><p className="text-gray-300">{aiAnalysis.gentleSuggestion}</p></div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}