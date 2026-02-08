"use client"

import { useState } from "react"
import { Heart, Lock, Sparkles, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"

interface ReceivedCard {
  id: string
  senderName: string
  message: string
  unlocksAt: Date
  color: string
  isAnonymous: boolean
}

interface InboxViewProps {
  receivedCards: ReceivedCard[]
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
          className="relative overflow-hidden rounded-2xl transition-all"
          style={{
            background: !isUnlocked ? "rgba(255,255,255,0.03)" : opened ? `linear-gradient(135deg, ${card.color}, ${card.color}cc)` : `${card.color}15`,
            border: `1px solid ${isUnlocked ? `${card.color}${opened ? "40" : "20"}` : "rgba(255,255,255,0.06)"}`,
          }}
        >
          {/* Locked overlay with lock and countdown */}
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-black/50 rounded-2xl">
              <Lock className="h-6 w-6 text-white/30" />
              <span className="text-xs font-bold text-white/40">{"Доступно с 14 февраля"}</span>
              <span className="text-[10px] text-white/25 tabular-nums">
                {days > 0 && `${days}д `}{hours}ч
              </span>
            </div>
          )}

          <div className={`flex items-center gap-4 p-4 ${!isUnlocked ? "locked-blur" : ""}`}>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isUnlocked ? "animate-heartbeat" : ""}`}
              style={{ background: opened ? "rgba(255,255,255,0.2)" : `${card.color}25` }}
            >
              {isUnlocked ? (
                <Heart className="h-7 w-7" style={{ fill: opened ? "#fff" : card.color, color: opened ? "#fff" : card.color }} />
              ) : (
                <Heart className="h-6 w-6 text-white/15" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-base font-bold ${opened ? "text-white" : "text-foreground"}`}>
                {card.isAnonymous ? "Тайный поклонник" : card.senderName}
              </p>
              {isUnlocked && (
                <p className={`text-xs ${opened ? "text-white/70" : "text-[#ff4d6d]"}`}>
                  {opened ? "Нажми, чтобы свернуть" : "Нажми, чтобы прочитать"}
                </p>
              )}
            </div>
            {isUnlocked && (
              <motion.div animate={{ rotate: opened ? 180 : 0 }}>
                <ChevronDown className={`h-5 w-5 ${opened ? "text-white/60" : "text-white/20"}`} />
              </motion.div>
            )}
            {isUnlocked && !opened && (
              <div className="h-2.5 w-2.5 shrink-0 animate-badge-pulse rounded-full bg-[#ff4d6d]" />
            )}
          </div>

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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.success("Ответ отправлен!")
                    }}
                    className="tap-effect mt-3 rounded-lg bg-white/20 px-4 py-2 text-xs font-bold text-white"
                  >
                    {"Ответить"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  )
}

export function InboxView({ receivedCards }: InboxViewProps) {
  const unlockedCount = receivedCards.filter(c => new Date() >= c.unlocksAt).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col px-4 pt-8 pb-32">
      <div className="mb-6 px-2">
        <h2 className="text-2xl font-extrabold text-foreground text-balance">{"Лента валентинок"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {receivedCards.length === 0
            ? "Полученные валентинки появятся здесь"
            : `${unlockedCount} из ${receivedCards.length} готовы к открытию`}
        </p>
      </div>

      {receivedCards.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-16">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
            <Image src="/images/cupid.jpg" alt="Купидон" width={100} height={100} className="rounded-full opacity-50" />
          </motion.div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground/60 mb-1">{"Пока нет валентинок"}</p>
            <p className="text-sm text-muted-foreground max-w-[250px]">{"Поделись ссылкой с друзьями, чтобы получить анонимные валентинки"}</p>
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
