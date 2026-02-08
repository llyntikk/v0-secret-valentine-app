"use client"

import { useState } from "react"
import { Heart, Lock, Sparkles, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ReceivedCard {
  id: string
  senderHint: string
  message: string
  unlocksAt: Date
  color: string
}

interface InboxViewProps {
  receivedCards: ReceivedCard[]
  userName: string
}

function CardEnvelope({ card, index }: { card: ReceivedCard; index: number }) {
  const [opened, setOpened] = useState(false)
  const now = new Date()
  const isUnlocked = now >= card.unlocksAt

  const diff = card.unlocksAt.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 150 }}
    >
      <button
        type="button"
        onClick={() => isUnlocked && setOpened(!opened)}
        disabled={!isUnlocked}
        className="tap-effect w-full text-left"
      >
        <div
          className="overflow-hidden rounded-2xl transition-all"
          style={{
            background: opened
              ? `linear-gradient(135deg, ${card.color}, ${card.color}cc)`
              : `${card.color}15`,
            border: `1px solid ${card.color}${opened ? "40" : "20"}`,
          }}
        >
          <div className="flex items-center gap-4 p-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${
                isUnlocked ? "animate-heartbeat" : ""
              }`}
              style={{
                background: opened ? "rgba(255,255,255,0.2)" : `${card.color}25`,
              }}
            >
              {isUnlocked ? (
                <Heart className="h-7 w-7" style={{ fill: opened ? "#fff" : card.color, color: opened ? "#fff" : card.color }} />
              ) : (
                <Lock className="h-6 w-6 text-white/25" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-base font-bold ${opened ? "text-white" : "text-foreground"}`}>
                {card.senderHint}
              </p>
              {isUnlocked ? (
                <p className={`text-xs ${opened ? "text-white/70" : "text-[#ff6b81]"}`}>
                  {opened ? "Tap to collapse" : "Tap to reveal the message"}
                </p>
              ) : (
                <p className="text-xs text-white/30 tabular-nums">
                  {"Opens in "}
                  {days > 0 && `${days}d `}{hours}h
                </p>
              )}
            </div>

            {isUnlocked && (
              <motion.div animate={{ rotate: opened ? 180 : 0 }}>
                <ChevronDown className={`h-5 w-5 ${opened ? "text-white/60" : "text-white/20"}`} />
              </motion.div>
            )}

            {isUnlocked && !opened && (
              <div className="h-2.5 w-2.5 shrink-0 animate-badge-pulse rounded-full bg-[#ff0844]" />
            )}
          </div>

          {/* Expanded message */}
          <AnimatePresence>
            {opened && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/10 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                    <p className="text-sm text-white/90 leading-relaxed">{card.message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  )
}

export function InboxView({ receivedCards, userName }: InboxViewProps) {
  const unlockedCount = receivedCards.filter((c) => new Date() >= c.unlocksAt).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col px-4 pt-8 pb-32"
    >
      {/* Inbox header */}
      <div className="mb-6 px-2">
        <h2 className="text-2xl font-extrabold text-foreground text-balance">
          Your Valentine Cards
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {receivedCards.length === 0
            ? "Cards you receive will appear here"
            : `${unlockedCount} of ${receivedCards.length} cards ready to open`}
        </p>
      </div>

      {receivedCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 py-16"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" }}
            >
              <Image
                src="/images/cupid.jpg"
                alt="Cupid"
                width={100}
                height={100}
                className="rounded-full opacity-50"
              />
            </motion.div>
            <div className="absolute -bottom-1 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-white/5 blur-md" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground/60 mb-1">No cards yet</p>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Share your link with friends to receive anonymous Valentine cards
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          {receivedCards.map((card, i) => (
            <CardEnvelope key={card.id} card={card} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
