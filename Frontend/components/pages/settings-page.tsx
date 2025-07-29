"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Moon, Sun, Monitor, Bell, Shield, Download, Trash2 } from "lucide-react"

export function SettingsPage() {
  const [theme, setTheme] = useState("dark")
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
    aiInsights: false,
  })
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: false,
    shareProgress: true,
  })

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {themeOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  theme === option.value
                    ? "bg-purple-600/20 border-purple-500/50"
                    : "bg-white/5 border-white/10 hover:border-purple-500/30"
                }`}
                onClick={() => setTheme(option.value)}
              >
                <option.icon className="h-5 w-5 text-gray-400" />
                <span className="text-white">{option.label}</span>
                {theme === option.value && <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export Data to PDF
            </Button>

            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Data
            </Button>

            <p className="text-xs text-gray-400">
              Exported data includes all journal entries, mood tracking, and progress statistics.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
