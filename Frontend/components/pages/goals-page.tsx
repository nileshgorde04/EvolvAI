"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Target, Plus, Trash2, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

// --- Types ---
interface Task {
  id: string
  name: string
  is_completed: boolean
}

interface Goal {
  id: string
  title: string
  tasks: Task[]
}

// --- API Helper (Re-usable) ---
const api = {
  get: async (endpoint: string, token: string) => {
    const response = await fetch(`http://localhost:8080/api${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error("Failed to fetch data.");
    return response.json();
  },
  post: async (endpoint: string, body: any, token: string) => {
    const response = await fetch(`http://localhost:8080/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) { const err = await response.json(); throw new Error(err.message); }
    return response.json();
  },
  put: async (endpoint: string, body: any, token: string) => {
     const response = await fetch(`http://localhost:8080/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error("Failed to update data.");
    return response.json();
  },
  delete: async (endpoint: string, token: string) => {
    const response = await fetch(`http://localhost:8080/api${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to delete data.");
    return response.json();
  }
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [newTaskName, setNewTaskName] = useState("");

  // The goal to display is the most recent one
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

  const handleCreateGoal = async (title: string, tasks: string[] = []) => {
    const token = localStorage.getItem('token');
    if (!token || !title.trim()) return;

    try {
      const newGoalData = await api.post('/goals', { title }, token);
      newGoalData.tasks = [];
      
      if (tasks.length > 0) {
          for (const taskName of tasks) {
              const newTask = await api.post(`/goals/${newGoalData.id}/tasks`, { name: taskName }, token);
              newGoalData.tasks.push(newTask);
          }
      }
      
      setGoals([newGoalData, ...goals]);
      toast.success(`Goal "${title}" created!`);
      setNewGoalTitle("");
      setIsAddGoalOpen(false);
    } catch (error) {
      toast.error("Failed to create goal.");
    }
  };
  
  const handleAIGenerate = async () => {
      if (!newGoalTitle.trim()) { toast.warning("Please enter a goal title."); return; }
      setIsAIGenerating(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
          const result = await api.post('/goals/ai-generate-tasks', { goalTitle: newGoalTitle }, token);
          await handleCreateGoal(newGoalTitle, result.tasks);
      } catch (error) {
          toast.error("AI failed to generate tasks. Please try again.");
      } finally {
          setIsAIGenerating(false);
      }
  };

  const handleAddTask = async () => {
      if (!newTaskName.trim() || !activeGoal) return;
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
          const newTask = await api.post(`/goals/${activeGoal.id}/tasks`, { name: newTaskName }, token);
          setGoals(goals.map(g => g.id === activeGoal.id ? { ...g, tasks: [...g.tasks, newTask] } : g));
          setNewTaskName("");
      } catch (error) {
          toast.error("Failed to add task.");
      }
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
      if (!activeGoal) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
          await api.put(`/goals/tasks/${taskId}`, { is_completed: !isCompleted }, token);
          setGoals(goals.map(g => 
              g.id === activeGoal.id ? { ...g, tasks: g.tasks.map(t => t.id === taskId ? { ...t, is_completed: !isCompleted } : t) } : g
          ));
      } catch (error) {
          toast.error("Failed to update task.");
      }
  };

  const calculateProgress = (tasks: Task[] = []) => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.is_completed).length / tasks.length) * 100);
  };

  const completionPercentage = calculateProgress(activeGoal?.tasks);
  const getMotivationalMessage = () => {
    if (completionPercentage >= 80) return "🚀 Almost there! You're crushing it!"
    if (completionPercentage >= 50) return "👍 Great progress! Keep pushing forward!"
    return "💪 Your journey begins with a single step!"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">My Goals</h1>
        </div>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700"><Plus className="mr-2 h-4 w-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader><DialogTitle className="text-white">Create a New Goal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="E.g., Learn Next.js" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} className="bg-transparent border-white/10 text-white" />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => handleCreateGoal(newGoalTitle)} className="flex-1">Create Manually</Button>
                <Button onClick={handleAIGenerate} disabled={isAIGenerating} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  {isAIGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} Generate with AI
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-gray-400 text-center">Loading goals...</p>}

      {!isLoading && !activeGoal && (
        <Card className="glass-card border-white/10 text-center p-10">
            <h3 className="text-2xl font-semibold text-white">Set Your First Goal!</h3>
            <p className="text-gray-400 mt-2 mb-4">What is the one big thing you want to achieve?</p>
            <Button onClick={() => setIsAddGoalOpen(true)} className="bg-purple-600 hover:bg-purple-700">Create Your First Goal</Button>
        </Card>
      )}

      {activeGoal && (
        <>
          <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <CardHeader><CardTitle className="text-white">{activeGoal.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{completionPercentage}% Complete</span>
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <p className="text-center text-gray-300 font-medium">{getMotivationalMessage()}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader><CardTitle className="text-white">Task Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {activeGoal.tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${task.is_completed ? "bg-green-900/20 border-green-500/30" : "bg-white/5 border-white/10"}`}
                    >
                      <Checkbox checked={task.is_completed} onCheckedChange={() => handleToggleTask(task.id, task.is_completed)} className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                      <span className={`flex-1 ${task.is_completed ? "text-green-400 line-through" : "text-white"}`}>{task.name}</span>
                      {task.is_completed && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="h-5 w-5 text-green-400" /></motion.div>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex space-x-2 mt-4">
                  <Input placeholder="Add a new task..." value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} className="bg-transparent border-white/10" onKeyPress={e => e.key === 'Enter' && handleAddTask()} />
                  <Button onClick={handleAddTask}><Plus className="h-4 w-4"/></Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  )
}