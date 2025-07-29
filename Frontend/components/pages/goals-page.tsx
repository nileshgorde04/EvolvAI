"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Target, Plus, Edit3, Trash2, CheckCircle2, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Task {
  id: string
  name: string
  completed: boolean
}

export function GoalsPage() {
  const [mainGoal, setMainGoal] = useState("Become DevOps Engineer")
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Complete AWS Certification", completed: true },
    { id: "2", name: "Learn Kubernetes", completed: true },
    { id: "3", name: "Master Docker", completed: false },
    { id: "4", name: "Study Terraform", completed: false },
    { id: "5", name: "Build CI/CD Pipeline", completed: false },
    { id: "6", name: "Practice Infrastructure as Code", completed: false },
  ])
  const [newTaskName, setNewTaskName] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100)

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        completed: false,
      }
      setTasks((prev) => [...prev, newTask])
      setNewTaskName("")
      setIsAddingTask(false)
    }
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const getMotivationalMessage = () => {
    if (completionPercentage >= 80) return "🔥 Almost there! You're crushing it!"
    if (completionPercentage >= 60) return "💪 Great progress! Keep pushing forward!"
    if (completionPercentage >= 40) return "🚀 You're building momentum!"
    if (completionPercentage >= 20) return "🌱 Every step counts! Keep going!"
    return "✨ Your journey begins with a single step!"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Target className="h-6 w-6 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Goals</h1>
      </div>

      {/* Main Goal */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">What's your main goal?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              value={mainGoal}
              onChange={(e) => setMainGoal(e.target.value)}
              className="text-lg font-semibold bg-transparent border-white/10 text-white"
            />
            <Button variant="ghost" size="icon">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{completionPercentage}% Complete</span>
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <p className="text-center text-gray-300 font-medium">{getMotivationalMessage()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card className="glass-card border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Task Breakdown</CardTitle>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter task name..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="bg-transparent border-white/10 text-white"
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />
                <div className="flex space-x-2">
                  <Button onClick={addTask} className="flex-1">
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingTask(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    task.completed
                      ? "bg-green-900/20 border-green-500/30"
                      : "bg-white/5 border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                  </motion.div>

                  <span className={`flex-1 ${task.completed ? "text-green-400 line-through" : "text-white"}`}>
                    {task.name}
                  </span>

                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </motion.div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
