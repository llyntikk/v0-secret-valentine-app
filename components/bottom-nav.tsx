"use client"

import { User, Heart, Inbox } from "lucide-react"
import { motion } from "framer-motion"

type Tab = "profile" | "inbox" | "send"

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  inboxCount: number
}

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "send", label: "Send Love", icon: Heart },
]

export function BottomNav({ activeTab, onTabChange, inboxCount }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="tap-effect relative flex flex-1 flex-col items-center gap-1 py-3 pb-7"
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full"
                  style={{ background: "linear-gradient(90deg, #ff0844, #ffb199)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`h-6 w-6 transition-all duration-200 ${
                    isActive
                      ? tab.id === "send"
                        ? "fill-[#ff0844] text-[#ff0844] scale-110"
                        : "text-[#ff0844] scale-110"
                      : "text-white/30"
                  }`}
                />

                {/* Badge for inbox */}
                {tab.id === "inbox" && inboxCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                    style={{ background: "#ff0844" }}
                  >
                    {inboxCount > 9 ? "9+" : inboxCount}
                  </motion.div>
                )}
              </div>

              <span
                className={`text-[11px] font-semibold transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-white/30"
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
