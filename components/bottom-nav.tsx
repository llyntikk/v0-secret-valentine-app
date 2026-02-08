"use client"

import { User, Heart } from "lucide-react"
import { motion } from "framer-motion"

interface BottomNavProps {
  activeTab: "profile" | "send"
  onTabChange: (tab: "profile" | "send") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass">
      <div className="mx-auto flex max-w-lg items-center">
        <button
          type="button"
          onClick={() => onTabChange("profile")}
          className="tap-effect relative flex flex-1 flex-col items-center gap-1 py-3 pb-6"
          aria-label="My Profile"
        >
          {activeTab === "profile" && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
              style={{ background: "linear-gradient(90deg, #ff0844, #ffb199)" }}
            />
          )}
          <User
            className={`h-6 w-6 transition-colors ${
              activeTab === "profile" ? "text-[#ff0844]" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-xs font-semibold transition-colors ${
              activeTab === "profile" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            My Profile
          </span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("send")}
          className="tap-effect relative flex flex-1 flex-col items-center gap-1 py-3 pb-6"
          aria-label="Send Love"
        >
          {activeTab === "send" && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
              style={{ background: "linear-gradient(90deg, #ff0844, #ffb199)" }}
            />
          )}
          <Heart
            className={`h-6 w-6 transition-colors ${
              activeTab === "send" ? "fill-[#ff0844] text-[#ff0844]" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-xs font-semibold transition-colors ${
              activeTab === "send" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Send Love
          </span>
        </button>
      </div>
    </div>
  )
}
