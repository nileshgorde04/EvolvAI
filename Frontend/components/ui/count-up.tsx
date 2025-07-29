"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

interface CountUpAnimationProps {
  end: number
  duration?: number
  start?: number
}

export function CountUpAnimation({ end, duration = 2, start = 0 }: CountUpAnimationProps) {
  const count = useMotionValue(start)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(start)

  useEffect(() => {
    const controls = animate(count, end, { duration })

    const unsubscribe = rounded.onChange((latest) => {
      setDisplayValue(latest)
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [count, end, duration, rounded])

  return <motion.span>{displayValue.toLocaleString()}</motion.span>
}
