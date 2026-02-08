"use client"

import { useState } from "react"
import { Link, Send, Share2, Heart, Lock, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ReceivedCard {
  id: string
  senderHint: string
  unlocksAt: Date
}

interface StepCardsProps {
  referralLink: string
  receivedCards: ReceivedCard[]
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-base font-bold text-background transition-colors"
    >
      <Link className="h-5 w-5" />
      {copied ? "Copied!" : "Copy Link"}
    </button>
  )
}

function CountdownTimer({ target }: { target: Date }) {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return <span className="text-sm text-[#ff0844] font-semibold">Unlocked!</span>
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return (
    <span className="text-xs text-muted-foreground">
      {"Unlocks in "}
      {days > 0 && `${days}d `}
      {hours}h
    </span>
  )
}

export function StepCards({ referralLink, receivedCards }: StepCardsProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      {/* Step 1: Copy Link */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #ff0844, #c2185b)" }}
      >
        <div className="relative">
          {/* Decorative ribbon */}
          <div className="absolute -top-5 -right-5 h-20 w-20 rotate-45 opacity-20"
            style={{ background: "linear-gradient(135deg, #ffb199, transparent)" }}
          />
          <h2 className="mb-1 text-lg font-extrabold text-white">Step 1: Copy Your Link</h2>
          <p className="mb-4 text-sm text-white/70">Share it to receive anonymous Valentine cards</p>
          <p className="mb-3 truncate rounded-lg bg-black/20 px-3 py-2 text-xs text-white/80 font-mono">
            {referralLink}
          </p>
          <CopyButton text={referralLink} />
        </div>
      </motion.div>

      {/* Step 2: Share */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #2e7d32, #1b5e20)" }}
      >
        <div className="relative">
          <div className="absolute -top-5 -right-5 h-20 w-20 rotate-45 opacity-20"
            style={{ background: "linear-gradient(135deg, #a5d6a7, transparent)" }}
          />
          <h2 className="mb-1 text-lg font-extrabold text-white">Step 2: Share With Friends</h2>
          <p className="mb-4 text-sm text-white/70">The more you share, the more cards you get</p>
          <div className="flex gap-3">
            <button
              type="button"
              className="tap-effect flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-bold text-[#1b5e20] transition-colors"
            >
              <Share2 className="h-5 w-5" />
              Stories
            </button>
            <button
              type="button"
              className="tap-effect flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-bold text-[#1b5e20] transition-colors"
            >
              <Send className="h-5 w-5" />
              Friends
            </button>
          </div>
        </div>
      </motion.div>

      {/* Step 3: Received Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #6a1b9a, #4a148c)" }}
      >
        <div className="relative">
          <div className="absolute -top-5 -right-5 h-20 w-20 rotate-45 opacity-20"
            style={{ background: "linear-gradient(135deg, #ce93d8, transparent)" }}
          />
          <h2 className="mb-1 text-lg font-extrabold text-white">Step 3: Your Cards</h2>
          <p className="mb-4 text-sm text-white/70">Anonymous Valentine cards from your admirers</p>

          <AnimatePresence mode="wait">
            {receivedCards.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <div className="relative h-16 w-16">
                  <Image
                    src="/images/cupid.jpg"
                    alt="Cupid"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <p className="text-center text-sm text-white/60">
                  No cards yet. Share your link to receive Valentine cards!
                </p>
                <button
                  type="button"
                  className="tap-effect flex min-h-[48px] items-center gap-2 rounded-xl bg-white/20 px-6 py-3 text-sm font-bold text-white transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Boost Your Link
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                {receivedCards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                        <Lock className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{card.senderHint}</p>
                        <CountdownTimer target={card.unlocksAt} />
                      </div>
                    </div>
                    <Heart className="h-5 w-5 text-[#ff0844]/50" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Step 4: Participate in Giveaway */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #f57c00, #e65100)" }}
      >
        <div className="relative">
          <div className="absolute -top-5 -right-5 h-20 w-20 rotate-45 opacity-20"
            style={{ background: "linear-gradient(135deg, #ffcc80, transparent)" }}
          />
          <h2 className="mb-1 text-lg font-extrabold text-white">Step 4: Valentine Giveaway</h2>
          <p className="mb-4 text-sm text-white/70">
            Send cards to friends and win amazing prizes on Valentine{"'"}s Day
          </p>
          <button
            type="button"
            className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#e65100] transition-colors"
          >
            <Heart className="h-5 w-5 fill-current" />
            Join Giveaway
          </button>
        </div>
      </motion.div>

      {/* Step 5: Subscribe */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="overflow-hidden rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #1565c0, #0d47a1)" }}
      >
        <div className="relative">
          <div className="absolute -top-5 -right-5 h-20 w-20 rotate-45 opacity-20"
            style={{ background: "linear-gradient(135deg, #90caf9, transparent)" }}
          />
          <h2 className="mb-1 text-lg font-extrabold text-white">Step 5: Follow Us</h2>
          <p className="mb-4 text-sm text-white/70">Stay updated with Secret Valentine news</p>
          <button
            type="button"
            className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#0d47a1] transition-colors"
          >
            <Send className="h-5 w-5" />
            Subscribe to Channel
          </button>
        </div>
      </motion.div>
    </div>
  )
}
