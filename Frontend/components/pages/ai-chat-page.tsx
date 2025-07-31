"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Lightbulb, TrendingUp, Target } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

const ClientTime = ({ timestamp }: { timestamp: Date }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return <p className="text-xs text-gray-500 mt-2">{timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
}

const examplePrompts = [
  { text: "Suggest new habit", icon: Lightbulb },
  { text: "How was my week?", icon: TrendingUp },
  { text: "Improve productivity", icon: Target },
  { text: "Analyze my mood patterns", icon: Sparkles },
]

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "ai", content: "Hello! I'm your AI companion. Ask me anything about your progress, or for tips on personal growth.", timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return

    const userMessage: Message = { id: Date.now().toString(), type: "user", content: content.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication error", { description: "You must be logged in to chat." });
        setIsTyping(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: content.trim() })
      });
      
      if (!response.ok) {
        throw new Error("AI service is busy.");
      }

      const data = await response.json();
      const aiResponse: Message = { id: (Date.now() + 1).toString(), type: "ai", content: data.reply, timestamp: new Date() }
      setMessages((prev) => [...prev, aiResponse])

    } catch (error: any) {
      toast.info("Serving you with a smile!", {
        description: "Our AI companion is currently very popular. Please try again in a moment.",
      });
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center space-x-2 mb-6"><Bot className="h-6 w-6 text-purple-400" /><h1 className="text-3xl font-bold text-white">AI Chat</h1></div>
      {messages.length <= 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-gray-400 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <motion.div key={prompt.text} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                <Badge variant="outline" className="cursor-pointer hover:bg-purple-600/20 hover:border-purple-500/50 transition-all" onClick={() => setInputValue(prompt.text)}>
                  <prompt.icon className="mr-1 h-3 w-3" />{prompt.text}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-purple-600" : "bg-gradient-to-r from-blue-600 to-purple-600"}`}>{message.type === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}</div>
                <Card className={`glass-card border-white/10 ${message.type === "user" ? "bg-purple-600/20" : "bg-blue-600/10"}`}>
                  <CardContent className="p-4"><div className="prose prose-invert prose-sm max-w-none text-white whitespace-pre-wrap">{message.content}</div><ClientTime timestamp={message.timestamp} /></CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"><Bot className="h-4 w-4 text-white" /></div>
              <Card className="glass-card border-white/10 bg-blue-600/10"><CardContent className="p-4"><div className="flex space-x-1"><div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div><div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div></div></CardContent></Card>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <Card className="glass-card border-white/10">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input placeholder="Ask something..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)} className="flex-1 bg-transparent border-white/10 text-white placeholder:text-gray-400" />
            <Button onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim() || isTyping} className="bg-purple-600 hover:bg-purple-700"><Send className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}