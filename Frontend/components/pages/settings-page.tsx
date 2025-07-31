"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { SettingsIcon, Moon, Sun, Monitor, Bell, Shield, Download, Trash2 } from "lucide-react"
import { toast } from "sonner"

// A custom hook to manage state with localStorage
function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(error);
            return defaultValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}


export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useLocalStorageState('evolvAI_notifications', {
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
  });

  const [privacy, setPrivacy] = useLocalStorageState('evolvAI_privacy', {
    shareProgress: true,
  });

  const handleExportData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return toast.error("You must be logged in.");

      toast.info("Preparing your data for export...");
      try {
          const response = await fetch('http://localhost:8080/api/settings/export', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error("Failed to fetch data.");
          
          const data = await response.json();
          const jsonString = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'evolvAI_data_export.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Your data has been exported.");
      } catch (error) {
          toast.error("Data export failed.");
      }
  };

  const handleDeleteAllData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return toast.error("You must be logged in.");

      toast.info("Deleting all your data...");
      try {
          const response = await fetch('http://localhost:8080/api/settings/delete-all', {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error("Failed to delete data.");
          
          toast.success("All your data has been deleted.", {
              description: "You will now be logged out.",
              duration: 5000,
          });
          
          setTimeout(() => {
              localStorage.removeItem('token');
              router.push('/auth/login');
          }, 3000);

      } catch (error) {
          toast.error("Failed to delete your data.");
      }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-6 w-6 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader><CardTitle className="text-white">Theme</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {themeOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${theme === option.value ? "bg-purple-600/20 border-purple-500/50" : "bg-white/5 border-white/10 hover:border-purple-500/30"}`}
                onClick={() => setTheme(option.value)}
              >
                <option.icon className="h-5 w-5 text-gray-400" />
                <span className="text-white">{option.label}</span>
                {theme === option.value && <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full"></div>}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader><CardTitle className="text-white flex items-center"><Bell className="mr-2 h-5 w-5" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                <Switch id={key} checked={value} onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader><CardTitle className="text-white flex items-center"><Shield className="mr-2 h-5 w-5" />Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                <Switch id={key} checked={value} onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, [key]: checked }))} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader><CardTitle className="text-white">Data Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleExportData} variant="outline" className="w-full justify-start bg-transparent">
              <Download className="mr-2 h-4 w-4" />Export All Data
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="mr-2 h-4 w-4" />Delete All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. This will permanently delete all your journals, goals, and other data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllData} className="bg-red-600 hover:bg-red-700">Yes, delete everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-gray-400">Exported data will be in JSON format.</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}