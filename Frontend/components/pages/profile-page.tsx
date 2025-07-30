"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Edit3, Flame, Coins, BookOpen, Trophy, Star, Award, Target, Loader2 } from "lucide-react"
import { CountUpAnimation } from "@/components/ui/count-up"
import { toast } from "sonner"

// --- Types ---
interface UserProfile { name: string; email: string; profile_picture_url: string | null; }
interface UserStats { totalLogs: number; currentStreak: number; goalsCompleted: number; coinsEarned: number; }
interface LevelInfo { level: number; xp: number; xpForNextLevel: number; }
interface ProfileData { user: UserProfile; stats: UserStats; levelInfo: LevelInfo; }

const allBadges = [
  { id: 1, name: "7 Day Streak", icon: Flame, description: "Logged for 7 consecutive days", color: "text-orange-400", requirement: (stats: UserStats) => stats.currentStreak >= 7 },
  { id: 2, name: "First Journal", icon: BookOpen, description: "Completed your first journal entry", color: "text-blue-400", requirement: (stats: UserStats) => stats.totalLogs >= 1 },
  { id: 3, name: "30 Day Warrior", icon: Trophy, description: "Log for 30 consecutive days", color: "text-yellow-400", requirement: (stats: UserStats) => stats.currentStreak >= 30 },
  { id: 4, name: "Goal Crusher", icon: Target, description: "Completed your first major goal", color: "text-green-400", requirement: (stats: UserStats) => stats.goalsCompleted >= 1 },
];

export function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to view your profile.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/profile', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error("Failed to fetch profile data.");
      const data = await response.json();
      setProfileData(data);
      setEditName(data.user.name);
      setEditAvatarUrl(data.user.profile_picture_url || "");
    } catch (error) {
      toast.error("Could not load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileUpdate = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
          await fetch('http://localhost:8080/api/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ name: editName, profile_picture_url: editAvatarUrl })
          });
          toast.success("Profile updated!");
          setIsEditModalOpen(false);
          fetchProfileData(); // Refresh data
      } catch (error) {
          toast.error("Failed to update profile.");
      }
  };

  const earnedBadges = profileData ? allBadges.filter(badge => badge.requirement(profileData.stats)) : [];

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>;
  if (!profileData) return <p className="text-center text-gray-400">Could not load profile data.</p>;

  const { user, stats, levelInfo } = profileData;
  const xpForCurrentLevel = levelInfo.level > 1 ? getXpForNextLevel(levelInfo.level - 1) : 0;
  const xpProgress = levelInfo.xp - xpForCurrentLevel;
  const xpNeeded = levelInfo.xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 100;

  function getXpForNextLevel(level: number): number {
    const thresholds = [0, 150, 300, 500, 800, 1200, 1700, 2300, 3000, 4000, 5000];
    return level < thresholds.length ? thresholds[level] : thresholds[thresholds.length - 1];
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2"><User className="h-6 w-6 text-purple-400" /><h1 className="text-3xl font-bold text-white">Profile & Rewards</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24"><AvatarImage src={user.profile_picture_url || '/placeholder-user.jpg'} alt={user.name} /><AvatarFallback className="text-2xl">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="text-center"><h3 className="text-xl font-bold text-white">{user.name}</h3><p className="text-gray-400">{user.email}</p></div>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild><Button variant="outline" size="sm"><Edit3 className="mr-2 h-4 w-4" />Edit Profile</Button></DialogTrigger>
                  <DialogContent className="glass-card border-white/10">
                    <DialogHeader><DialogTitle className="text-white">Edit Your Profile</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label htmlFor="edit-name" className="text-gray-300">Name</Label><Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-transparent" /></div>
                      <div><Label htmlFor="edit-avatar" className="text-gray-300">Profile Picture URL</Label><Input id="edit-avatar" value={editAvatarUrl} onChange={(e) => setEditAvatarUrl(e.target.value)} placeholder="https://..." className="bg-transparent" /></div>
                      <Button onClick={handleProfileUpdate} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white">Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><BookOpen className="h-4 w-4 text-blue-400" /><span className="text-gray-300">Total Logs</span></div><span className="text-white font-semibold"><CountUpAnimation end={stats.totalLogs} /></span></div>
              <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Flame className="h-4 w-4 text-orange-400" /><span className="text-gray-300">Current Streak</span></div><span className="text-orange-400 font-semibold"><CountUpAnimation end={stats.currentStreak} /> days</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Coins className="h-4 w-4 text-yellow-400" /><span className="text-gray-300">Coins Earned</span></div><span className="text-yellow-400 font-semibold"><CountUpAnimation end={stats.coinsEarned} /></span></div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <CardHeader><CardTitle className="text-white flex items-center"><Star className="mr-2 h-5 w-5 text-yellow-400" />Level Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-2xl font-bold text-white">Level {levelInfo.level}</span><span className="text-gray-400"><CountUpAnimation end={levelInfo.xp} /> / {levelInfo.xpForNextLevel} XP</span></div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-gray-400">{levelInfo.xpForNextLevel - levelInfo.xp} XP until Level {levelInfo.level + 1}</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white flex items-center justify-between"><div className="flex items-center"><Trophy className="mr-2 h-5 w-5 text-yellow-400" />Achievements</div><Badge variant="outline" className="text-gray-400">{earnedBadges.length} / {allBadges.length}</Badge></CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allBadges.map((badge, index) => {
                  const isEarned = earnedBadges.some(eb => eb.id === badge.id);
                  return (
                    <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className={`p-4 rounded-lg border transition-all ${isEarned ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30" : "bg-white/5 border-white/10 opacity-60"}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${isEarned ? "bg-yellow-500/20" : "bg-gray-500/20"}`}><badge.icon className={`h-5 w-5 ${isEarned ? badge.color : "text-gray-500"}`} /></div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isEarned ? "text-white" : "text-gray-400"}`}>{badge.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                          {isEarned && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + index * 0.1 }} className="mt-2"><Badge className="bg-green-600/20 text-green-400 border-green-500/30">Earned</Badge></motion.div>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}