"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Lightbulb, TrendingUp, Target } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

const examplePrompts = [
  { text: "Suggest new habit", icon: Lightbulb },
  { text: "How was my week?", icon: TrendingUp },
  { text: "Improve productivity", icon: Target },
  { text: "Analyze my mood patterns", icon: Sparkles },
]

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI companion here to help you with personal development insights, habit suggestions, and analyzing your progress. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("habit")) {
      return "Based on your recent journal entries, I'd suggest trying a **5-minute morning meditation**. Your mood patterns show you're most productive when you start the day with intention.\n\n**Why this habit?**\n• Improves focus and clarity\n• Reduces stress levels\n• Takes minimal time to build consistency\n\nWould you like me to help you create a plan to implement this?"
    }

    if (input.includes("week") || input.includes("progress")) {
      return "Looking at your week, here's what stands out:\n\n**🔥 Strengths:**\n• Maintained a 12-day streak\n• Productivity averaged 7.2/10\n• Mood trend is upward\n\n**💡 Areas for growth:**\n• Screen time increased by 15%\n• Sleep consistency could improve\n\n**Recommendation:** Try setting a digital sunset at 9 PM to improve sleep quality."
    }

    if (input.includes("productivity")) {
      return "Here are **3 evidence-based strategies** to boost your productivity:\n\n**1. Time Blocking** ⏰\nSchedule specific tasks in calendar blocks\n\n**2. The 2-Minute Rule** ⚡\nIf it takes less than 2 minutes, do it now\n\n**3. Energy Management** 🔋\nAlign high-focus tasks with your peak energy hours\n\nBased on your journal data, your peak focus time appears to be **9-11 AM**. Would you like help creating a morning routine?"
    }

    if (input.includes("mood")) {
      return "Your mood analysis reveals interesting patterns:\n\n**📈 Positive trends:**\n• Higher mood scores on days with 8+ hours sleep\n• Gratitude entries correlate with better days\n• Exercise days show 23% mood improvement\n\n**🎯 Insight:** Your mood is most stable when you maintain consistent sleep and include physical activity. Consider making these non-negotiables in your routine."
    }

    return "Hey please enter some other query or ask for help with a specific topic like habits, productivity, or mood analysis."
  }

  const handleExamplePrompt = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Bot className="h-6 w-6 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">AI Chat</h1>
      </div>

      {/* Example Prompts */}
      {messages.length <= 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-gray-400 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <motion.div
                key={prompt.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-600/20 hover:border-purple-500/50 transition-all"
                  onClick={() => handleExamplePrompt(prompt.text)}
                >
                  <prompt.icon className="mr-1 h-3 w-3" />
                  {prompt.text}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-purple-600" : "bg-gradient-to-r from-blue-600 to-purple-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                <Card
                  className={`glass-card border-white/10 ${
                    message.type === "user" ? "bg-purple-600/20" : "bg-blue-600/10"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="prose prose-invert prose-sm max-w-none">
                      {message.content.split("\n").map((line, index) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <p key={index} className="font-semibold text-white mb-2">
                              {line.slice(2, -2)}
                            </p>
                          )
                        }
                        if (line.startsWith("• ")) {
                          return (
                            <p key={index} className="text-gray-300 ml-4 mb-1">
                              {line}
                            </p>
                          )
                        }
                        return line ? (
                          <p key={index} className="text-gray-300 mb-2">
                            {line}
                          </p>
                        ) : (
                          <br key={index} />
                        )
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <Card className="glass-card border-white/10 bg-blue-600/10">
                <CardContent className="p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="glass-card border-white/10">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
              className="flex-1 bg-transparent border-white/10 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
