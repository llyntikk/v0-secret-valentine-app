"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingHearts } from "@/components/floating-hearts"
import { HeaderSection } from "@/components/header-section"
import { StepCards } from "@/components/step-cards"
import { SendCardModal } from "@/components/send-card-modal"
import { BottomNav } from "@/components/bottom-nav"
import { InboxView } from "@/components/inbox-view"
import { Heart, Gift, Send, Sparkles } from "lucide-react"
import Image from "next/image"

const MOCK_USER = {
  name: "Тайный Валентин",
  avatarUrl: "/images/cupid.jpg",
  referralLink: `t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || "secretvalentinebot"}/app?ref=G8ZRG5`,
  heartsCount: 3,
  streakDays: 5,
}

const MOCK_CARDS = [
  {
    id: "c1",
    senderName: "Аня",
    message: "Ты делаешь каждый день особенным. Твоя улыбка освещает всё вокруг!",
    unlocksAt: new Date(Date.now() - 1000 * 60 * 60),
    color: "#800f2f",
    isAnonymous: true,
  },
  {
    id: "c2",
    senderName: "Дима",
    message: "Я давно хотел тебе это сказать... Ты потрясающий человек!",
    unlocksAt: new Date(Date.now() - 1000 * 60 * 30),
    color: "#ff4d6d",
    isAnonymous: false,
  },
  {
    id: "c3",
    senderName: "Тайный поклонник",
    message: "Эта открытка будет доступна скоро...",
    unlocksAt: new Date(2026, 1, 14), // Feb 14, 2026
    color: "#6a1b9a",
    isAnonymous: true,
  },
  {
    id: "c4",
    senderName: "Катя",
    message: "С Днём Святого Валентина! Ты заслуживаешь всего самого лучшего!",
    unlocksAt: new Date(2026, 1, 14),
    color: "#1565c0",
    isAnonymous: true,
  },
]

type Tab = "profile" | "inbox" | "send"

function SendLoveView({ onOpenModal }: { onOpenModal: () => void }) {
  const actions = [
    {
      icon: Heart,
      gradient: "linear-gradient(135deg, #800f2f, #c9184a)",
      title: "Написать валентинку",
      subtitle: "Создай уникальное послание с любовью",
      delay: 0.1,
    },
    {
      icon: Gift,
      gradient: "linear-gradient(135deg, #f57c00, #e65100)",
      title: "Отправить подарок",
      subtitle: "Прикрепи стикер к своей открытке",
      delay: 0.2,
    },
    {
      icon: Send,
      gradient: "linear-gradient(135deg, #1565c0, #0d47a1)",
      title: "Быстрая валентинка",
      subtitle: "Отправь готовую открытку в один клик",
      delay: 0.3,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center px-4 pt-8 pb-32">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="relative mb-6">
        <div className="flex h-28 w-28 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle, rgba(128,15,47,0.2) 0%, rgba(128,15,47,0.05) 70%)" }}>
          <Image src="/images/cupid.jpg" alt="Купидон" width={80} height={80} className="rounded-full" />
        </div>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1">
          <Sparkles className="h-5 w-5 text-[#ffd700]" />
        </motion.div>
      </motion.div>

      <h2 className="mb-2 text-center text-2xl font-extrabold text-foreground text-balance">{"Отправить валентинку"}</h2>
      <p className="mb-8 text-center text-sm text-muted-foreground leading-relaxed max-w-[280px]">
        {"Выбери друга и отправь ему анонимную или именную валентинку с любовью."}
      </p>

      <div className="flex w-full flex-col gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.title}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: action.delay }}
            onClick={onOpenModal}
            className="tap-effect flex items-center gap-4 rounded-2xl p-4 glass-strong"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: action.gradient }}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-base font-bold text-foreground">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.subtitle}</p>
            </div>
            <div className="text-white/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 w-full rounded-2xl p-4 text-center"
        style={{ background: "linear-gradient(135deg, rgba(128,15,47,0.1), rgba(255,77,109,0.05))", border: "1px solid rgba(128,15,47,0.15)" }}
      >
        <p className="text-xs font-semibold text-muted-foreground mb-1">{"Дневной челлендж"}</p>
        <p className="text-sm font-bold text-foreground">{"Отправь 3 валентинки и получи бонус!"}</p>
        <div className="mt-2 flex justify-center gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-1.5 w-8 rounded-full" style={{ background: i <= 1 ? "#ff4d6d" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

const pageVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
}
const tabOrder: Tab[] = ["profile", "inbox", "send"]

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [modalOpen, setModalOpen] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]))
  const [direction, setDirection] = useState(0)

  // Telegram WebApp init mock
  useEffect(() => {
    try {
      // @ts-expect-error Telegram WebApp SDK
      const tg = window.Telegram?.WebApp
      if (tg) {
        tg.ready()
        tg.expand()
        tg.setHeaderColor("#0a0a0a")
        tg.BackButton?.onClick(() => {
          if (activeTab !== "profile") {
            setActiveTab("profile")
          }
        })
        if (activeTab !== "profile") {
          tg.BackButton?.show()
        } else {
          tg.BackButton?.hide()
        }
      }
    } catch { /* not in Telegram context */ }
  }, [activeTab])

  const handleTabChange = useCallback((tab: Tab) => {
    const ci = tabOrder.indexOf(activeTab)
    const ni = tabOrder.indexOf(tab)
    setDirection(ni > ci ? 1 : -1)
    setActiveTab(tab)
  }, [activeTab])

  const handleCompleteStep = useCallback((step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]))
  }, [])

  const inboxCount = MOCK_CARDS.filter(c => new Date() >= c.unlocksAt).length

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      <FloatingHearts />
      <div className="relative z-10 mx-auto max-w-lg">
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === "profile" && (
            <motion.div key="profile" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeInOut" }}>
              <HeaderSection userName={MOCK_USER.name} avatarUrl={MOCK_USER.avatarUrl} heartsCount={MOCK_USER.heartsCount} streakDays={MOCK_USER.streakDays} completedSteps={completedSteps.size} totalSteps={5} />
              <StepCards referralLink={MOCK_USER.referralLink} receivedCards={MOCK_CARDS} completedSteps={completedSteps} onCompleteStep={handleCompleteStep} />
              <div className="h-24" />
            </motion.div>
          )}
          {activeTab === "inbox" && (
            <motion.div key="inbox" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeInOut" }}>
              <InboxView receivedCards={MOCK_CARDS} />
            </motion.div>
          )}
          {activeTab === "send" && (
            <motion.div key="send" custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeInOut" }}>
              <SendLoveView onOpenModal={() => setModalOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} inboxCount={inboxCount} />
      <SendCardModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
