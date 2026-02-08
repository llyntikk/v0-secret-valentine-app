"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Link, Send, Share2, Heart, Lock, Zap, Check, Gift, Users, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Image from "next/image"

interface ReceivedCard {
  id: string
  senderHint: string
  message: string
  unlocksAt: Date
  color: string
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
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback
    }
    setCopied(true)
    onCopied()
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2500)
  }, [text, onCopied])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="tap-effect relative flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3 text-base font-bold transition-colors"
      style={{ color: "#c2185b" }}
    >
      {copied && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, #ff0844, transparent)" }}
        />
      )}
      {copied ? (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          Copied!
        </motion.span>
      ) : (
        <>
          <Link className="h-5 w-5" />
          Copy Link
        </>
      )}
    </button>
  )
}

function ShareButton({ onShare }: { onShare: () => void }) {
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Secret Valentine",
          text: "Send me a Valentine card anonymously!",
          url: "https://t.me/secretvalentine",
        })
        onShare()
        toast.success("Shared successfully!")
      } catch {
        // user cancelled
      }
    } else {
      onShare()
      toast.success("Share link activated!")
    }
  }, [onShare])

  return (
    <button
      type="button"
      onClick={handleShare}
      className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold transition-colors"
      style={{ color: "#2e7d32" }}
    >
      <Share2 className="h-5 w-5" />
      Share
    </button>
  )
}

function CardFlip({ card }: { card: ReceivedCard }) {
  const [flipped, setFlipped] = useState(false)
  const now = new Date()
  const isUnlocked = now >= card.unlocksAt

  return (
    <motion.div
      className="perspective-1000 relative h-24 w-full cursor-pointer"
      onClick={() => isUnlocked && setFlipped(!flipped)}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="backface-hidden absolute inset-0 flex items-center gap-3 rounded-xl px-4"
          style={{ background: `${card.color}20`, border: `1px solid ${card.color}30` }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ background: `${card.color}30` }}
          >
            {isUnlocked ? (
              <Heart className="h-5 w-5" style={{ fill: card.color, color: card.color }} />
            ) : (
              <Lock className="h-5 w-5 text-white/40" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{card.senderHint}</p>
            {isUnlocked ? (
              <p className="text-xs text-white/60">Tap to reveal</p>
            ) : (
              <CountdownTimer target={card.unlocksAt} />
            )}
          </div>
          {isUnlocked && (
            <div className="animate-badge-pulse h-2.5 w-2.5 rounded-full bg-[#ff0844]" />
          )}
        </div>

        {/* Back */}
        <div
          className="backface-hidden absolute inset-0 flex items-center gap-3 rounded-xl px-4"
          style={{
            background: `${card.color}20`,
            border: `1px solid ${card.color}30`,
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{card.senderHint}</p>
            <p className="text-xs text-white/80 mt-0.5 line-clamp-2">{card.message}</p>
          </div>
          <Heart className="h-6 w-6 shrink-0 animate-heartbeat" style={{ fill: card.color, color: card.color }} />
        </div>
      </motion.div>
    </motion.div>
  )
}

function CountdownTimer({ target }: { target: Date }) {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return <span className="text-xs text-[#ff6b81] font-semibold">Ready to open!</span>
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return (
    <span className="text-[11px] text-white/40 tabular-nums">
      {"Opens in "}
      {days > 0 && `${days}d `}
      {hours}h {mins}m
    </span>
  )
}

function StepCard({
  step,
  completed,
  delay,
  gradient,
  children,
}: {
  step: number
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
      {/* Corner ribbon */}
      <div className="ribbon-corner" />

      {/* Completion checkmark */}
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
      {/* Step 1: Copy Link */}
      <StepCard
        step={1}
        completed={completedSteps.has(1)}
        delay={0.1}
        gradient="linear-gradient(135deg, #ff0844, #c2185b)"
      >
        <h2 className="mb-1 text-lg font-extrabold text-white">Step 1: Copy Your Link</h2>
        <p className="mb-3 text-sm text-white/70">Share it so friends can send you anonymous cards</p>
        <p className="mb-3 truncate rounded-xl bg-black/20 px-3 py-2.5 text-xs text-white/80 font-mono">
          {referralLink}
        </p>
        <CopyButton text={referralLink} onCopied={() => onCompleteStep(1)} />
      </StepCard>

      {/* Step 2: Share */}
      <StepCard
        step={2}
        completed={completedSteps.has(2)}
        delay={0.2}
        gradient="linear-gradient(135deg, #2e7d32, #1b5e20)"
      >
        <h2 className="mb-1 text-lg font-extrabold text-white">Step 2: Share With Friends</h2>
        <p className="mb-4 text-sm text-white/70">The more you share, the more love you get</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              onCompleteStep(2)
              toast.success("Shared to Stories!")
            }}
            className="tap-effect flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-base font-bold text-[#1b5e20] transition-colors"
          >
            <Share2 className="h-5 w-5" />
            Stories
          </button>
          <ShareButton onShare={() => onCompleteStep(2)} />
        </div>
      </StepCard>

      {/* Step 3: Received Cards (Inbox) */}
      <StepCard
        step={3}
        completed={completedSteps.has(3)}
        delay={0.3}
        gradient="linear-gradient(135deg, #6a1b9a, #4a148c)"
      >
        <h2 className="mb-1 text-lg font-extrabold text-white">Step 3: Your Cards</h2>
        <p className="mb-4 text-sm text-white/70">Tap unlocked cards to reveal the sender</p>

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
                  alt="Cupid waiting"
                  width={64}
                  height={64}
                  className="rounded-full opacity-60"
                />
              </div>
              <p className="text-center text-sm text-white/50">
                No cards yet. Share your link and wait for Valentine surprises!
              </p>
              <button
                type="button"
                onClick={() => {
                  onCompleteStep(3)
                  toast("Boost activated!", { description: "Your link will be promoted" })
                }}
                className="tap-effect flex min-h-[48px] items-center gap-2 rounded-xl bg-white/15 px-6 py-3 text-sm font-bold text-white transition-colors"
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
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CardFlip card={card} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </StepCard>

      {/* Step 4: Giveaway */}
      <StepCard
        step={4}
        completed={completedSteps.has(4)}
        delay={0.4}
        gradient="linear-gradient(135deg, #f57c00, #e65100)"
      >
        <h2 className="mb-1 text-lg font-extrabold text-white">Step 4: Valentine Giveaway</h2>
        <p className="mb-4 text-sm text-white/70">
          {"Send cards to friends and win prizes on Valentine's Day"}
        </p>
        <button
          type="button"
          onClick={() => {
            onCompleteStep(4)
            toast.success("You joined the giveaway!", { description: "Winners announced Feb 14" })
          }}
          className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#e65100] transition-colors"
        >
          <Gift className="h-5 w-5" />
          Join Giveaway
        </button>
      </StepCard>

      {/* Step 5: Subscribe */}
      <StepCard
        step={5}
        completed={completedSteps.has(5)}
        delay={0.5}
        gradient="linear-gradient(135deg, #1565c0, #0d47a1)"
      >
        <h2 className="mb-1 text-lg font-extrabold text-white">Step 5: Follow Us</h2>
        <p className="mb-4 text-sm text-white/70">Stay updated with Secret Valentine news</p>
        <button
          type="button"
          onClick={() => {
            onCompleteStep(5)
            toast.success("Subscribed!", { description: "You'll receive Valentine updates" })
          }}
          className="tap-effect flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-[#0d47a1] transition-colors"
        >
          <Bell className="h-5 w-5" />
          Subscribe to Channel
        </button>
      </StepCard>
    </div>
  )
}
