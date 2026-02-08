"use client"

import { Heart, Flame, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface HeaderSectionProps {
  userName: string
  avatarUrl: string
  heartsCount: number
  streakDays: number
  completedSteps: number
  totalSteps: number
}

function CountdownToValentine() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const now = new Date()
      let valentine = new Date(now.getFullYear(), 1, 14) // Feb 14
      if (now > valentine) {
        valentine = new Date(now.getFullYear() + 1, 1, 14)
      }
      const diff = valentine.getTime() - now.getTime()
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTimeLeft(calc())
    const timer = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(timer)
  }, [])

  const units = [
    { label: "d", value: timeLeft.days },
    { label: "h", value: timeLeft.hours },
    { label: "m", value: timeLeft.minutes },
    { label: "s", value: timeLeft.seconds },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-1.5 rounded-xl px-3 py-2 glass"
    >
      <Clock className="h-3.5 w-3.5 text-[#ff6b81]" />
      <div className="flex items-center gap-1">
        {units.map((u) => (
          <div key={u.label} className="flex items-baseline gap-px">
            <span className="text-sm font-extrabold tabular-nums text-foreground">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-muted-foreground">{u.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function HeaderSection({
  userName,
  avatarUrl,
  heartsCount,
  streakDays,
  completedSteps,
  totalSteps,
}: HeaderSectionProps) {
  const progressPercent = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient banner */}
      <div
        className="absolute inset-0 h-56 animate-gradient-shift"
        style={{
          background: "linear-gradient(135deg, #ff0844, #c2185b, #880e4f, #ff0844)",
          backgroundSize: "200% 200%",
        }}
      />
      {/* Mesh overlay */}
      <div
        className="absolute inset-0 h-56"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(255,177,153,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,8,68,0.3) 0%, transparent 50%)",
        }}
      />
      {/* Fade to background */}
      <div
        className="absolute inset-0 h-56"
        style={{
          background: "linear-gradient(180deg, transparent 50%, hsl(0 100% 4%) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center gap-4 px-6 pt-8 pb-4"
      >
        {/* Avatar with animated ring */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="relative"
        >
          <div
            className="animate-pulse-glow h-[104px] w-[104px] rounded-full p-[3px]"
            style={{ background: "linear-gradient(135deg, #ff0844, #ffb199, #ff0844)" }}
          >
            <div className="h-full w-full overflow-hidden rounded-full bg-background p-[2px]">
              <div className="h-full w-full overflow-hidden rounded-full">
                <Image
                  src={avatarUrl || "/placeholder.svg"}
                  alt={`${userName}'s avatar`}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Streak badge - floating top-right */}
          {streakDays > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
              className="absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background"
              style={{ background: "linear-gradient(135deg, #ff9100, #ff6d00)" }}
            >
              <Flame className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Name + badge */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{userName}</h1>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
          >
            <Heart className="h-3 w-3 fill-current text-[#ff6b81]" />
            Secret Valentine
          </motion.span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          {/* Hearts counter */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 glass"
          >
            <Heart className="h-4 w-4 fill-[#ff0844] text-[#ff0844] animate-heartbeat" />
            <span className="text-base font-extrabold text-foreground">{heartsCount}</span>
            <span className="text-xs text-muted-foreground">cards</span>
          </motion.div>

          {/* Streak counter */}
          {streakDays > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 rounded-xl px-4 py-2 glass"
            >
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-base font-extrabold text-foreground">{streakDays}</span>
              <span className="text-xs text-muted-foreground">streak</span>
            </motion.div>
          )}

          {/* Countdown */}
          <CountdownToValentine />
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-xs"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">
              {completedSteps}/{totalSteps} steps done
            </span>
            <span className="text-[11px] font-bold text-[#ff6b81]">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #ff0844, #ffb199)" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
