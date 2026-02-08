"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingHearts } from "@/components/floating-hearts"
import { HeaderSection } from "@/components/header-section"
import { StepCards } from "@/components/step-cards"
import { SendCardModal } from "@/components/send-card-modal"
import { BottomNav } from "@/components/bottom-nav"
import { InboxView } from "@/components/inbox-view"
import { Heart, Gift, Send, Sparkles } from "lucide-react"
import Image from "next/image"

// Demo data
const MOCK_USER = {
  name: "Valentine User",
  avatarUrl: "/images/cupid.jpg",
  referralLink: "t.me/secretvalentine/app?ref=ABC123",
  heartsCount: 3,
  streakDays: 5,
}

const MOCK_CARDS = [
  {
    id: "c1",
    senderHint: "Secret Admirer",
    message: "You make every day feel like Valentine's Day. Your smile lights up the whole room!",
    unlocksAt: new Date(Date.now() - 1000 * 60 * 60), // unlocked
    color: "#ff0844",
  },
  {
    id: "c2",
    senderHint: "Someone Special",
    message: "I've been wanting to tell you this for a long time... You're amazing!",
    unlocksAt: new Date(Date.now() - 1000 * 60 * 30), // unlocked
    color: "#e91e63",
  },
  {
    id: "c3",
    senderHint: "Mystery Valentine",
    message: "This card will be revealed soon...",
    unlocksAt: new Date(Date.now() + 1000 * 60 * 60 * 12), // locked
    color: "#9c27b0",
  },
]

type Tab = "profile" | "inbox" | "send"

function SendLoveView({ onOpenModal }: { onOpenModal: () => void }) {
  const actions = [
    {
      icon: Heart,
      gradient: "linear-gradient(135deg, #ff0844, #c2185b)",
      title: "Write a Card",
      subtitle: "Craft a heartfelt Valentine message",
      delay: 0.1,
    },
    {
      icon: Gift,
      gradient: "linear-gradient(135deg, #f57c00, #e65100)",
      title: "Send a Gift",
      subtitle: "Attach a special sticker with your card",
      delay: 0.2,
    },
    {
      icon: Send,
      gradient: "linear-gradient(135deg, #1565c0, #0d47a1)",
      title: "Quick Valentine",
      subtitle: "Send a pre-made Valentine in one tap",
      delay: 0.3,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center px-4 pt-8 pb-32"
    >
      {/* Hero */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,8,68,0.2) 0%, rgba(255,8,68,0.05) 70%)",
          }}
        >
          <Image src="/images/cupid.jpg" alt="Cupid" width={80} height={80} className="rounded-full" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-5 w-5 text-[#ffd700]" />
        </motion.div>
      </motion.div>

      <h2 className="mb-2 text-center text-2xl font-extrabold text-foreground text-balance">
        Send a Valentine Card
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground leading-relaxed max-w-[280px]">
        Choose a friend and send them an anonymous or signed Valentine card with love.
      </p>

      {/* Action cards */}
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
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: action.gradient }}
            >
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-base font-bold text-foreground">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.subtitle}</p>
            </div>
            <div className="text-white/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick send suggestion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 w-full rounded-2xl p-4 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,8,68,0.08), rgba(255,177,153,0.05))",
          border: "1px solid rgba(255,8,68,0.1)",
        }}
      >
        <p className="text-xs font-semibold text-muted-foreground mb-1">Daily Challenge</p>
        <p className="text-sm font-bold text-foreground">
          Send 3 cards today to earn a streak bonus!
        </p>
        <div className="mt-2 flex justify-center gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 w-8 rounded-full"
              style={{ background: i <= 1 ? "#ff0844" : "rgba(255,255,255,0.1)" }}
            />
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

  const handleTabChange = useCallback(
    (tab: Tab) => {
      const currentIdx = tabOrder.indexOf(activeTab)
      const nextIdx = tabOrder.indexOf(tab)
      setDirection(nextIdx > currentIdx ? 1 : -1)
      setActiveTab(tab)
    },
    [activeTab],
  )

  const handleCompleteStep = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }, [])

  const inboxCount = MOCK_CARDS.filter((c) => new Date() >= c.unlocksAt).length

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      <FloatingHearts />

      <div className="relative z-10 mx-auto max-w-lg">
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <HeaderSection
                userName={MOCK_USER.name}
                avatarUrl={MOCK_USER.avatarUrl}
                heartsCount={MOCK_USER.heartsCount}
                streakDays={MOCK_USER.streakDays}
                completedSteps={completedSteps.size}
                totalSteps={5}
              />
              <StepCards
                referralLink={MOCK_USER.referralLink}
                receivedCards={MOCK_CARDS}
                completedSteps={completedSteps}
                onCompleteStep={handleCompleteStep}
              />
              <div className="h-24" />
            </motion.div>
          )}

          {activeTab === "inbox" && (
            <motion.div
              key="inbox"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <InboxView receivedCards={MOCK_CARDS} userName={MOCK_USER.name} />
            </motion.div>
          )}

          {activeTab === "send" && (
            <motion.div
              key="send"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
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
