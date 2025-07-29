"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, TrendingUp, Target, Trophy, Brain, ArrowRight, Star, Users, Mail } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: BookOpen,
    title: "Journaling with AI",
    description: "Smart insights and personalized feedback on your daily reflections",
  },
  {
    icon: TrendingUp,
    title: "Visualize Your Growth",
    description: "Beautiful charts and analytics to track your personal development journey",
  },
  {
    icon: Target,
    title: "Set & Crush Goals",
    description: "Break down big dreams into actionable steps with AI-powered guidance",
  },
  {
    icon: Trophy,
    title: "Earn Rewards & Badges",
    description: "Stay motivated with achievements and milestone celebrations",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    content: "EvolvAI transformed how I approach personal growth. The AI insights are incredibly accurate and helpful.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    content: "Finally, a journaling app that actually helps me understand my patterns and improve consistently.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Designer",
    content: "The interface is beautiful and the habit tracking keeps me accountable. Love the gamification aspect!",
    rating: 5,
  },
]

export function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold gradient-text">EvolvAI</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:text-purple-300">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/30">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered Self-Growth Platform
              </Badge>

              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                <span className="gradient-text">EvolvAI</span>
                <br />
                Smart Self-Growth Made Simple
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Transform your personal development journey with AI-powered insights, beautiful visualizations, and
                gamified progress tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToFeatures}
                  className="text-lg px-8 border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-16"
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="glass-card p-8 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card border-white/10">
                      <CardContent className="p-4 text-center">
                        <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <h3 className="text-white font-semibold">AI Insights</h3>
                        <p className="text-gray-400 text-sm">Smart analysis</p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <h3 className="text-white font-semibold">Growth Tracking</h3>
                        <p className="text-gray-400 text-sm">Visual progress</p>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                      <CardContent className="p-4 text-center">
                        <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <h3 className="text-white font-semibold">Achievements</h3>
                        <p className="text-gray-400 text-sm">Stay motivated</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to grow</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to accelerate your personal development journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border-white/10 h-full hover:border-purple-500/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Loved by thousands of users</h2>
            <p className="text-xl text-gray-300">See what our community has to say about their growth journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
              <CardContent className="p-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start your growth journey?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of users who are already transforming their lives with EvolvAI
                </p>
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold gradient-text">EvolvAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Smart self-growth made simple. Transform your personal development journey with AI-powered insights.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EvolvAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
