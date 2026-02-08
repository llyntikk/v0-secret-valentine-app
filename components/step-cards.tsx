"use client"

import React, { useState, useCallback } from "react"
import { Link, Share2, Heart, Lock, Zap, Gift, Bell, Check } from "lucide-react"
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

interface StepCardsProps {
  referralLink: string
  receivedCards: ReceivedCard[]
  completedSteps: Set<number>
  onCompleteStep: (step: number) => void
}

function CopyButton({ text, onCopied }: { text: string; onCopied: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
    setCopied(true)
    onCopied()
    toast.success("Ссылка скопирована!")
    setTimeout(() => setCopied(false), 2500)
  }, [text, onCopied])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="tap-effect relative flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3 text-base font-bold"
      style={{ color: "#800f2f" }}
    >
      {copied && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, #ff4d6d, transparent)" }}
        />
      )}
      {copied ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          {"Скопировано!"}
        </motion.span>
      ) : (
        <>
          <Link className="h-5 w-5" />
          {"Скопировать"}
        </>
      )}
    </button>
  )
}

/* Locked/Unlocked card in the inbox step */
function ValentineCard({ card, index }: { card: ReceivedCard; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const now = new Date()
  const isUnlocked = now >= card.unlocksAt

  const diff = card.unlocksAt.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        type="button"
        onClick={() => isUnlocked && setRevealed(!revealed)}
        disabled={!isUnlocked}
        className="tap-effect w-full text-left"
      >
        <div
          className="relative overflow-hidden rounded-xl transition-all"
          style={{
            background: isUnlocked
              ? revealed ? `linear-gradient(135deg, ${card.color}, ${card.color}cc)` : `${card.color}18`
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${isUnlocked ? `${card.color}30` : "rgba(255,255,255,0.06)"}`,
          }}
        >
          {/* Locked overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/40">
              <Lock className="h-5 w-5 text-white/40" />
              <span className="text-[11px] font-semibold text-white/40 tabular-nums">
                {"Доступно с 14 февраля"}
              </span>
              <span className="text-[10px] text-white/25 tabular-nums">
                {days > 0 && `${days}д `}{hours}ч {mins}м
              </span>
            </div>
          )}

          <div className={`flex items-center gap-3 p-4 ${!isUnlocked ? "locked-blur" : ""}`}>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isUnlocked ? "animate-heartbeat" : ""}`}
              style={{ background: isUnlocked ? `${card.color}30` : "rgba(255,255,255,0.05)" }}
            >
              <Heart className="h-5 w-5" style={{ fill: card.color, color: card.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${revealed ? "text-white" : "text-foreground"}`}>
                {card.isAnonymous ? "Тайный поклонник" : card.senderName}
              </p>
              <p className={`text-xs ${revealed ? "text-white/70" : "text-muted-foreground"}`}>
                {revealed ? card.message : "Нажми, чтобы прочитать"}
              </p>
            </div>
            {isUnlocked && !revealed && (
              <div className="h-2.5 w-2.5 shrink-0 animate-badge-pulse rounded-full bg-[#ff4d6d]" />
            )}
          </div>

          {/* Expanded message */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/10 px-4 py-3">
                  <p className="text-sm text-white/90 leading-relaxed mb-2">{card.message}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toast.success("Ответ отправлен!")
                    }}
                    className="tap-effect rounded-lg bg-white/20 px-4 py-2 text-xs font-bold text-white"
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

function StepCard({
  completed,
  delay,
  gradient,
  children,
}: {
  completed: boolean
  delay: number
  gradient: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 150 }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background: gradient }}
    >
      <div className="ribbon-corner" />
      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
        </motion.div>
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export function StepCards({ referralLink, receivedCards, completedSteps, onCompleteStep }: StepCardsProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      {/* Шаг 1 */}
      <StepCard completed={completedSteps.has(1)} delay={0.1} gradient="linear-gradient(135deg, #800f2f, #c9184a)">
        <h2 className="mb-1 text-lg font-extrabold text-white">{"Шаг 1: Скопируй свою ссылку"}</h2>
        <p className="mb-3 text-sm text-white/70">{"Поделись ей, чтобы получать валентинки"}</p>
        <p className="mb-3 truncate rounded-xl bg-black/20 px-3 py-2.5 text-xs text-white/80 font-mono">{referralLink}</p>
        <CopyButton text={referralLink} onCopied={() => onCompleteStep(1)} />
      </StepCard>

      {/* Шаг 2 */}
      <StepCard completed={completedSteps.has(2)} delay={0.2} gradient="linear-gradient(135deg, #2e7d32, #1b5e20)">
        <h2 className="mb-1 text-lg font-extrabold text-white">{"Шаг 2: Поделись с друзьями"}</h2>
        <p className="mb-4 text-sm text-white/70">{"С помощью неё друзья отправят тебе валентинки"}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              onCompleteStep(2)
              toast.success("Опубликовано в Stories!")
            }}
            className="tap-effect flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-bold text-[#1b5e20]"
          >
            <Share2 className="h-5 w-5" />
            {"Stories"}
          </button>
          <button
            type="button"
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "Тайный Валентин",
                    text: "Отправь мне анонимную валентинку!",
                    url: `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || "secretvalentinebot"}/app`,
                  })
                } catch { /* cancelled */ }
              }
              onCompleteStep(2)
              toast.success("Ссылка отправлена!")
            }}
            className="tap-effect flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-bold text-[#1b5e20]"
          >
            <Share2 className="h-5 w-5" />
            {"Поделиться"}
          </button>
        </div>
      </StepCard>

      {/* Шаг 3 */}
      <StepCard completed={completedSteps.has(3)} delay={0.3} gradient="linear-gradient(135deg, #6a1b9a, #4a148c)">
        <h2 className="mb-1 text-lg font-extrabold text-white">{"Шаг 3: Отправь валентинки друзьям"}</h2>
        <p className="mb-4 text-sm text-white/70">{"Раздели радость Дня Святого Валентина"}</p>

        {receivedCards.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative h-16 w-16">
              <Image src="/images/cupid.jpg" alt="Купидон" width={64} height={64} className="rounded-full opacity-60" />
            </div>
            <p className="text-center text-sm text-white/50">
              {"Пока нет валентинок. Поделись ссылкой!"}
            </p>
            <button
              type="button"
              onClick={() => { onCompleteStep(3); toast("Буст активирован!") }}
              className="tap-effect flex min-h-[48px] items-center gap-2 rounded-xl bg-white/15 px-6 py-3 text-sm font-bold text-white"
            >
              <Zap className="h-4 w-4" />
              {"Выбрать друга"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {receivedCards.map((card, i) => (
              <ValentineCard key={card.id} card={card} index={i} />
            ))}
          </div>
        )}
      </StepCard>

      {/* Шаг 4 */}
      <StepCard completed={completedSteps.has(4)} delay={0.4} gradient="linear-gradient(135deg, #f57c00, #e65100)">
        <h2 className="mb-1 text-lg font-extrabold text-white">{"Шаг 4: Участвуй в розыгрыше"}</h2>
        <p className="mb-4 text-sm text-white/70">
          {"Поздравь друзей и забери топовые призы 14 февраля"}
        </p>
        <button
          type="button"
          onClick={() => { onCompleteStep(4); toast.success("Ты участвуешь в розыгрыше!") }}
          className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#e65100]"
        >
          <Gift className="h-5 w-5" />
          {"Участвовать в розыгрыше"}
        </button>
      </StepCard>

      {/* Шаг 5 */}
      <StepCard completed={completedSteps.has(5)} delay={0.5} gradient="linear-gradient(135deg, #1565c0, #0d47a1)">
        <h2 className="mb-1 text-lg font-extrabold text-white">{"Шаг 5: Подпишись на наш канал"}</h2>
        <p className="mb-4 text-sm text-white/70">{"Следи за новостями Тайного Валентина"}</p>
        <button
          type="button"
          onClick={() => { onCompleteStep(5); toast.success("Подписка оформлена!") }}
          className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#0d47a1]"
        >
          <Bell className="h-5 w-5" />
          {"Подписаться на канал"}
        </button>
      </StepCard>
    </div>
  )
}
