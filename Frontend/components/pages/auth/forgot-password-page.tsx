"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, ArrowLeft, CheckCircle, Lock, Hash } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useRouter } from "next/navigation"

type Step = "enter-email" | "enter-code" | "enter-new-password" | "success";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("enter-email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error("Failed to send code.");
      toast.success("Code sent!", { description: "Check your email for the 6-digit code." });
      setStep("enter-code");
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      toast.success("Password reset successfully!");
      setStep("success");
      setTimeout(() => router.push('/auth/login'), 3000);

    } catch (error: any) {
      toast.error("Reset Failed", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "enter-email":
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-transparent" required />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">{isLoading ? "Sending..." : "Send Reset Code"}</Button>
          </form>
        );
      case "enter-code":
        return (
          <div className="flex flex-col items-center space-y-6">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>{[...Array(6)].map((_, i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <Button onClick={() => setStep("enter-new-password")} disabled={code.length < 6} className="w-full">Verify Code</Button>
          </div>
        );
      case "enter-new-password":
        return (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative mt-2"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-transparent" required /></div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-2"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 bg-transparent" required /></div>
            </div>
            <Button type="submit" disabled={isLoading || password !== confirmPassword} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">{isLoading ? "Resetting..." : "Reset Password"}</Button>
          </form>
        );
      case "success":
        return (
            <div className="text-center text-green-400 space-y-4">
                <CheckCircle className="h-16 w-16 mx-auto"/>
                <p className="text-lg">Password reset successfully!</p>
                <p className="text-sm text-gray-300">Redirecting you to the login page...</p>
            </div>
        );
    }
  };

  const getTitle = () => {
      switch(step) {
          case "enter-email": return "Reset your password";
          case "enter-code": return "Enter Verification Code";
          case "enter-new-password": return "Create a New Password";
          case "success": return "Success!";
      }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2"><Sparkles className="h-8 w-8 text-purple-400" /><span className="text-2xl font-bold gradient-text">EvolvAI</span></Link>
        </div>
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">{getTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
            {step !== "success" && (
                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="inline-flex items-center text-purple-400 hover:text-purple-300"><ArrowLeft className="w-4 h-4 mr-2" />Back to login</Link>
                </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
