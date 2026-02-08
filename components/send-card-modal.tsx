"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Heart, Send, ChevronRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface SendCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSent?: () => void
}

const CARD_TEMPLATES = [
  { id: "classic", label: "Classic", bg: "linear-gradient(135deg, #ff0844, #c2185b)", emoji: "heart" },
  { id: "golden", label: "Golden", bg: "linear-gradient(135deg, #ffd700, #ff8c00)", emoji: "star" },
  { id: "rose", label: "Rose", bg: "linear-gradient(135deg, #ff6b81, #ee5a6f)", emoji: "rose" },
  { id: "midnight", label: "Midnight", bg: "linear-gradient(135deg, #2c3e50, #8e44ad)", emoji: "moon" },
  { id: "ocean", label: "Ocean", bg: "linear-gradient(135deg, #1a73e8, #00bcd4)", emoji: "wave" },
]

const STICKERS = [
  { id: "s1", svg: "heart-red", color: "#ff0844", label: "Red Heart" },
  { id: "s2", svg: "heart-pink", color: "#e91e63", label: "Pink Heart" },
  { id: "s3", svg: "heart-gold", color: "#ffc107", label: "Gold Heart" },
  { id: "s4", svg: "heart-purple", color: "#9c27b0", label: "Purple Heart" },
  { id: "s5", svg: "heart-blue", color: "#2196f3", label: "Blue Heart" },
  { id: "s6", svg: "sparkle", color: "#ffd700", label: "Sparkle" },
]

const MOCK_FRIENDS = [
  { id: "f1", name: "Alex", initial: "A", color: "#ff0844" },
  { id: "f2", name: "Maria", initial: "M", color: "#e91e63" },
  { id: "f3", name: "Dmitry", initial: "D", color: "#9c27b0" },
  { id: "f4", name: "Anna", initial: "A", color: "#2196f3" },
  { id: "f5", name: "Nikita", initial: "N", color: "#ff9100" },
  { id: "f6", name: "Katya", initial: "K", color: "#1b5e20" },
]

function ConfettiBurst() {
  const [pieces, setPieces] = useState<
    { id: number; x: number; color: string; delay: number; rotation: number }[]
  >([])

  useEffect(() => {
    const colors = ["#ff0844", "#ffd700", "#ff6b81", "#e91e63", "#ffb199", "#ff4081"]
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }))
    setPieces(generated)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="animate-confetti absolute top-0"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        >
          <div
            className="h-2 w-2 rounded-sm"
            style={{
              background: p.color,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function StickerIcon({ color, type }: { color: string; type: string }) {
  if (type === "sparkle") {
    return (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.5 9.5L21 12L13.5 14.5L12 22L10.5 14.5L3 12L10.5 9.5L12 2Z" fill={color} />
      </svg>
    )
  }
  return <Heart className="h-7 w-7" style={{ fill: color, color }} />
}

export function SendCardModal({ isOpen, onClose, onSent }: SendCardModalProps) {
  const [step, setStep] = useState<"friend" | "write" | "preview">("friend")
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [anonymous, setAnonymous] = useState(true)
  const [selectedSticker, setSelectedSticker] = useState("s1")
  const [selectedTemplate, setSelectedTemplate] = useState("classic")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const reset = useCallback(() => {
    setStep("friend")
    setSelectedFriend(null)
    setMessage("")
    setAnonymous(true)
    setSelectedSticker("s1")
    setSelectedTemplate("classic")
    setSending(false)
    setSent(false)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const handleSend = useCallback(() => {
    if (!message.trim()) {
      toast.error("Please write a message first!")
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      toast.success("Valentine card sent!", {
        description: `Your ${anonymous ? "anonymous " : ""}card was delivered`,
      })
      onSent?.()
      setTimeout(() => {
        handleClose()
      }, 2000)
    }, 1200)
  }, [message, anonymous, handleClose, onSent])

  const currentTemplate = CARD_TEMPLATES.find((t) => t.id === selectedTemplate) || CARD_TEMPLATES[0]
  const currentSticker = STICKERS.find((s) => s.id === selectedSticker) || STICKERS[0]
  const currentFriend = MOCK_FRIENDS.find((f) => f.id === selectedFriend)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-t-3xl"
            style={{ background: "linear-gradient(180deg, #1e0505, #120101)", maxHeight: "92dvh" }}
          >
            {sent && <ConfettiBurst />}

            {/* Handle bar */}
            <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-white/20" />

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="tap-effect absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>

            <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: "calc(92dvh - 20px)" }}>
              {/* Step indicators */}
              <div className="mb-4 flex items-center justify-center gap-2">
                {(["friend", "write", "preview"] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        step === s
                          ? "bg-[#ff0844] text-white scale-110"
                          : i < ["friend", "write", "preview"].indexOf(step)
                            ? "bg-[#ff0844]/30 text-white/80"
                            : "bg-white/10 text-white/30"
                      }`}
                    >
                      {i < ["friend", "write", "preview"].indexOf(step) ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < 2 && <div className="h-px w-8 bg-white/10" />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Pick friend */}
                {step === "friend" && (
                  <motion.div
                    key="friend"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="mb-1 text-xl font-extrabold text-foreground">Choose Recipient</h2>
                    <p className="mb-5 text-sm text-muted-foreground">Who should receive your Valentine card?</p>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {MOCK_FRIENDS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFriend(f.id)}
                          className={`tap-effect flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                            selectedFriend === f.id
                              ? "ring-2 ring-[#ff0844] bg-white/10 scale-105"
                              : "bg-white/5"
                          }`}
                        >
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                            style={{ background: f.color }}
                          >
                            {f.initial}
                          </div>
                          <span className="text-xs font-semibold text-foreground">{f.name}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => selectedFriend && setStep("write")}
                      disabled={!selectedFriend}
                      className="tap-effect flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #ff0844, #c2185b)" }}
                    >
                      Continue
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Write card */}
                {step === "write" && (
                  <motion.div
                    key="write"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="mb-1 text-xl font-extrabold text-foreground">
                      Write Your Card
                      {currentFriend && (
                        <span className="text-[#ff6b81]">{" for "}{currentFriend.name}</span>
                      )}
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">Express your feelings</p>

                    {/* Card template picker */}
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Card Design
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                        {CARD_TEMPLATES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTemplate(t.id)}
                            className={`tap-effect shrink-0 flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all ${
                              selectedTemplate === t.id
                                ? "ring-2 ring-white/40 scale-105"
                                : "opacity-60"
                            }`}
                          >
                            <div
                              className="h-10 w-14 rounded-lg"
                              style={{ background: t.bg }}
                            />
                            <span className="text-[10px] font-semibold text-foreground">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your heartfelt message..."
                        rows={4}
                        maxLength={300}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-base text-foreground placeholder-white/30 outline-none focus:border-[#ff0844]/50 focus:ring-1 focus:ring-[#ff0844]/30 transition-colors"
                        style={{ fontSize: "16px" }}
                      />
                      <div className="mt-1 flex justify-end">
                        <span className={`text-[11px] ${message.length > 250 ? "text-[#ff6b81]" : "text-muted-foreground"}`}>
                          {message.length}/300
                        </span>
                      </div>
                    </div>

                    {/* Anonymous toggle */}
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <div>
                        <span className="text-sm font-semibold text-foreground">
                          {anonymous ? "Send Anonymously" : "Show My Name"}
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {anonymous ? "Recipient won't know who sent it" : "Your name will be visible"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnonymous(!anonymous)}
                        className={`relative h-7 w-12 rounded-full transition-colors ${
                          anonymous ? "bg-[#ff0844]" : "bg-white/20"
                        }`}
                        role="switch"
                        aria-checked={anonymous}
                        aria-label="Toggle anonymous"
                      >
                        <motion.div
                          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
                          animate={{ left: anonymous ? "calc(100% - 1.625rem)" : "0.125rem" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* Stickers */}
                    <div className="mb-5">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Attach Sticker
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {STICKERS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSticker(s.id)}
                            className={`tap-effect flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
                              selectedSticker === s.id
                                ? "ring-2 ring-[#ff0844] bg-white/10 scale-110"
                                : "bg-white/5"
                            }`}
                            aria-label={s.label}
                          >
                            <StickerIcon color={s.color} type={s.svg} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep("friend")}
                        className="tap-effect flex min-h-[52px] items-center justify-center rounded-xl bg-white/10 px-5 py-4 text-base font-bold text-white/60"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => message.trim() && setStep("preview")}
                        disabled={!message.trim()}
                        className="tap-effect flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all disabled:opacity-30"
                        style={{ background: "linear-gradient(135deg, #ff0844, #c2185b)" }}
                      >
                        Preview
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Preview & Send */}
                {step === "preview" && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="mb-4 text-xl font-extrabold text-foreground">Preview Your Card</h2>

                    {/* Live card preview */}
                    <motion.div
                      initial={{ scale: 0.9, rotateX: 10 }}
                      animate={{ scale: 1, rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="mb-5 overflow-hidden rounded-2xl p-6 text-center"
                      style={{ background: currentTemplate.bg }}
                    >
                      <div className="mb-3 flex justify-center">
                        <StickerIcon color={currentSticker.color} type={currentSticker.svg} />
                      </div>
                      <p className="text-base font-semibold text-white leading-relaxed mb-3 text-balance">
                        {message}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="h-3 w-3 text-white/40" />
                        <p className="text-xs text-white/50">
                          {anonymous ? "From: Secret Admirer" : "From: You"}
                          {currentFriend && <span>{" to "}{currentFriend.name}</span>}
                        </p>
                        <Sparkles className="h-3 w-3 text-white/40" />
                      </div>
                    </motion.div>

                    {/* Sent success state */}
                    <AnimatePresence>
                      {sent && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="mb-4 flex flex-col items-center gap-2 rounded-xl bg-[#ff0844]/10 p-4 text-center"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: 2, duration: 0.4 }}
                          >
                            <Heart className="h-10 w-10 fill-[#ff0844] text-[#ff0844]" />
                          </motion.div>
                          <p className="text-lg font-extrabold text-foreground">Sent with Love!</p>
                          <p className="text-sm text-muted-foreground">Your Valentine card is on its way</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!sent && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep("write")}
                          className="tap-effect flex min-h-[52px] items-center justify-center rounded-xl bg-white/10 px-5 py-4 text-base font-bold text-white/60"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={sending}
                          className="tap-effect flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all disabled:opacity-50"
                          style={{ background: "linear-gradient(135deg, #ff0844, #ffb199)" }}
                        >
                          {sending ? (
                            <span className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, ease: "linear" }}
                              >
                                <Heart className="h-5 w-5" />
                              </motion.div>
                              Delivering...
                            </span>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              Send Valentine
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Safe area spacer */}
                    <div className="h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
