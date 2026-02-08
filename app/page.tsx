"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FloatingHearts } from "@/components/floating-hearts"
import { HeaderSection } from "@/components/header-section"
import { StepCards } from "@/components/step-cards"
import { SendCardModal } from "@/components/send-card-modal"
import { BottomNav } from "@/components/bottom-nav"
import { Heart, Gift, Send } from "lucide-react"
import Image from "next/image"

// Mock data for demonstration
const MOCK_USER = {
  name: "Valentine User",
  avatarUrl: "/images/cupid.jpg",
  referralLink: "t.me/secretvalentine/app?ref=ABC123",
  heartsCount: 0,
  receivedCards: [] as { id: string; senderHint: string; unlocksAt: Date }[],
}

function SendLoveView({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center px-6 pt-10 pb-32"
    >
      {/* Hero section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-6 flex h-28 w-28 items-center justify-center rounded-full"
        style={{ background: "linear-gradient(135deg, rgba(255,8,68,0.2), rgba(255,177,153,0.1))" }}
      >
        <Image
          src="/images/cupid.jpg"
          alt="Cupid"
          width={80}
          height={80}
          className="rounded-full"
        />
      </motion.div>

      <h2 className="mb-2 text-center text-2xl font-extrabold text-foreground text-balance">
        Send a Valentine Card
      </h2>
      <p className="mb-8 text-center text-sm text-muted-foreground leading-relaxed max-w-xs">
        Choose a friend and send them an anonymous or signed Valentine card with a heartfelt message.
      </p>

      {/* Action cards */}
      <div className="flex w-full flex-col gap-4">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={onOpenModal}
          className="tap-effect flex items-center gap-4 rounded-2xl p-5 glass"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #ff0844, #c2185b)" }}
          >
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <div className="text-left">
            <p className="text-base font-bold text-foreground">Write a Card</p>
            <p className="text-sm text-muted-foreground">Craft a heartfelt Valentine message</p>
          </div>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onOpenModal}
          className="tap-effect flex items-center gap-4 rounded-2xl p-5 glass"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #f57c00, #e65100)" }}
          >
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <p className="text-base font-bold text-foreground">Send a Gift</p>
            <p className="text-sm text-muted-foreground">Attach a special sticker with your card</p>
          </div>
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onOpenModal}
          className="tap-effect flex items-center gap-4 rounded-2xl p-5 glass"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #6a1b9a, #4a148c)" }}
          >
            <Send className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <p className="text-base font-bold text-foreground">Quick Valentine</p>
            <p className="text-sm text-muted-foreground">Send a pre-made Valentine in one tap</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"profile" | "send">("profile")
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      <FloatingHearts />

      <div className="relative z-10 mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          {activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HeaderSection
                userName={MOCK_USER.name}
                avatarUrl={MOCK_USER.avatarUrl}
                heartsCount={MOCK_USER.heartsCount}
              />
              <StepCards
                referralLink={MOCK_USER.referralLink}
                receivedCards={MOCK_USER.receivedCards}
              />
              {/* Bottom padding for nav */}
              <div className="h-24" />
            </motion.div>
          ) : (
            <motion.div
              key="send"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SendLoveView onOpenModal={() => setModalOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <SendCardModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
