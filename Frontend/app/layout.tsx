import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner" // Import the Toaster

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EvolvAI - AI-Powered Personal Development",
  description: "Track mood, productivity, habits, goals, and emotional well-being with AI insights",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors /> {/* Add the Toaster component here */}
        </ThemeProvider>
      </body>
    </html>
  )
}
