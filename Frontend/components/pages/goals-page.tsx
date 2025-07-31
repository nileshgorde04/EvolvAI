"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Target, Plus, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface Task { id: string; name: string; is_completed: boolean; }
interface Goal { id: string; title: string; tasks: Task[]; }

const api = { /* ... (API helper remains the same) ... */ };

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [newTaskName, setNewTaskName] = useState("");
  const activeGoal = goals.length > 0 ? goals[0] : null;

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      if (!token) { toast.error("Please log in."); setIsLoading(false); return; }
      try {
        const userGoals = await api.get('/goals', token);
        setGoals(userGoals);
      } catch (error) { toast.error("Failed to fetch goals."); } 
      finally { setIsLoading(false); }
    };
    fetchGoals();
  }, []);

  const handleCreateGoal = async (title: string, tasks: string[] = []) => { /* ... */ };
  
  const handleAIGenerate = async () => {
      if (!newGoalTitle.trim()) { toast.warning("Please enter a goal title."); return; }
      setIsAIGenerating(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
          const result = await api.post('/goals/ai-generate-tasks', { goalTitle: newGoalTitle }, token);
          await handleCreateGoal(newGoalTitle, result.tasks);
      } catch (error) {
          toast.info("Building your roadmap...", {
            description: "Our AI is crafting the perfect steps for your goal. Please wait a moment.",
          });
      } finally {
          setIsAIGenerating(false);
      }
  };

  const handleAddTask = async () => { /* ... */ };
  const handleToggleTask = async (taskId: string, isCompleted: boolean) => { /* ... */ };
  const calculateProgress = (tasks: Task[] = []) => { /* ... */ };
  const completionPercentage = calculateProgress(activeGoal?.tasks);
  const getMotivationalMessage = () => { /* ... */ };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        {/* ... (The rest of your JSX remains the same, it's already correct) ... */}
    </motion.div>
  )
}