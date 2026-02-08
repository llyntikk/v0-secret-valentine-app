"use client"

import { useState } from "react"
import { X, Heart, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SendCardModalProps {
  isOpen: boolean
  onClose: () => void
}

const stickers = [
  { id: "heart-red", label: "Red Heart", color: "#ff0844" },
  { id: "heart-pink", label: "Pink Heart", color: "#e91e63" },
  { id: "heart-gold", label: "Gold Heart", color: "#ffc107" },
  { id: "heart-purple", label: "Purple Heart", color: "#9c27b0" },
]

export function SendCardModal({ isOpen, onClose }: SendCardModalProps) {
  const [message, setMessage] = useState("")
  const [anonymous, setAnonymous] = useState(true)
  const [selectedSticker, setSelectedSticker] = useState("heart-red")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setMessage("")
        onClose()
      }, 1500)
    }, 1000)
  }

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
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-t-3xl p-6"
            style={{ background: "linear-gradient(180deg, #1a0808, #120101)" }}
          >
            {/* Handle bar */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="tap-effect absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>

            <h2 className="mb-5 text-xl font-extrabold text-foreground">Send a Valentine Card</h2>

            {/* Message input */}
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-base text-foreground placeholder-muted-foreground outline-none focus:border-[#ff0844]/50 focus:ring-1 focus:ring-[#ff0844]/30"
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Anonymous toggle */}
            <div className="mb-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span className="text-sm font-semibold text-foreground">
                {anonymous ? "Send Anonymously" : "Show My Name"}
              </span>
              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  anonymous ? "bg-[#ff0844]" : "bg-white/20"
                }`}
                role="switch"
                aria-checked={anonymous}
                aria-label="Toggle anonymous sending"
              >
                <motion.div
                  className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ left: anonymous ? "calc(100% - 1.625rem)" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Sticker Gallery */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-semibold text-muted-foreground">Attach a Heart</p>
              <div className="flex gap-3">
                {stickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => setSelectedSticker(sticker.id)}
                    className={`tap-effect flex h-14 w-14 items-center justify-center rounded-xl transition-all ${
                      selectedSticker === sticker.id
                        ? "ring-2 ring-[#ff0844] scale-110 bg-white/10"
                        : "bg-white/5"
                    }`}
                    aria-label={sticker.label}
                  >
                    <Heart className="h-7 w-7" style={{ fill: sticker.color, color: sticker.color }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Send button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || sending || sent}
              className="tap-effect flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #ff0844, #ffb199)" }}
            >
              {sent ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-5 w-5 fill-white" />
                  Sent with Love!
                </motion.span>
              ) : sending ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                  >
                    <Heart className="h-5 w-5" />
                  </motion.div>
                  Sending...
                </span>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Valentine Card
                </>
              )}
            </button>

            {/* Safe area spacer */}
            <div className="h-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
