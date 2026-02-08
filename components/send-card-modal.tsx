"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Heart, Send, ChevronRight, Sparkles, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface SendCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSent?: () => void
}

const CARD_COLORS = [
  { id: "crimson", label: "Малиновый", bg: "#800f2f" },
  { id: "pink", label: "Розовый", bg: "#ff4d6d" },
  { id: "gold", label: "Золотой", bg: "#b8860b" },
  { id: "violet", label: "Фиолетовый", bg: "#6a1b9a" },
  { id: "ocean", label: "Синий", bg: "#1565c0" },
  { id: "emerald", label: "Изумрудный", bg: "#2e7d32" },
]

const MOCK_FRIENDS = [
  { id: "f1", name: "Алекс", initial: "А", color: "#800f2f" },
  { id: "f2", name: "Мария", initial: "М", color: "#ff4d6d" },
  { id: "f3", name: "Дмитрий", initial: "Д", color: "#6a1b9a" },
  { id: "f4", name: "Анна", initial: "А", color: "#1565c0" },
  { id: "f5", name: "Никита", initial: "Н", color: "#f57c00" },
  { id: "f6", name: "Катя", initial: "К", color: "#2e7d32" },
]

function ConfettiBurst() {
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string; delay: number; rotation: number }[]>([])

  useEffect(() => {
    const colors = ["#800f2f", "#ff4d6d", "#ffd700", "#c9184a", "#ff758f", "#ff4081"]
    setPieces(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    })))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="animate-confetti absolute top-0"
          style={{ left: `${p.x}%`, animationDelay: `${p.delay}s`, animationDuration: `${1.5 + Math.random()}s` }}
        >
          <div className="h-2 w-2 rounded-sm" style={{ background: p.color, transform: `rotate(${p.rotation}deg)` }} />
        </div>
      ))}
    </div>
  )
}

export function SendCardModal({ isOpen, onClose, onSent }: SendCardModalProps) {
  const [step, setStep] = useState<"friend" | "write" | "preview">("friend")
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [anonymous, setAnonymous] = useState(true)
  const [selectedColor, setSelectedColor] = useState("crimson")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const reset = useCallback(() => {
    setStep("friend")
    setSelectedFriend(null)
    setMessage("")
    setAnonymous(true)
    setSelectedColor("crimson")
    setSending(false)
    setSent(false)
  }, [])

  const handleClose = useCallback(() => { reset(); onClose() }, [reset, onClose])

  const handleSend = useCallback(async () => {
    if (!message.trim()) { toast.error("Напиши сообщение!"); return }
    setSending(true)
    // Mock API call
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: selectedFriend,
          message: message.trim(),
          isAnonymous: anonymous,
          cardColor: CARD_COLORS.find(c => c.id === selectedColor)?.bg || "#800f2f",
        }),
      })
    } catch { /* mock - ignore */ }
    setSending(false)
    setSent(true)
    toast.success("Валентинка отправлена!", {
      description: anonymous ? "Анонимная открытка доставлена" : "Открытка с твоим именем доставлена",
    })
    onSent?.()
    setTimeout(handleClose, 2000)
  }, [message, anonymous, selectedColor, selectedFriend, handleClose, onSent])

  const currentColor = CARD_COLORS.find(c => c.id === selectedColor) || CARD_COLORS[0]
  const currentFriend = MOCK_FRIENDS.find(f => f.id === selectedFriend)
  const stepIndex = ["friend", "write", "preview"].indexOf(step)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70" onClick={handleClose} />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-t-3xl"
            style={{ background: "linear-gradient(180deg, #140008, #0a0a0a)", maxHeight: "92dvh" }}
          >
            {sent && <ConfettiBurst />}

            <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-white/20" />

            <button type="button" onClick={handleClose} className="tap-effect absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-label="Закрыть">
              <X className="h-5 w-5 text-white/60" />
            </button>

            <div className="overflow-y-auto px-5 pb-8" style={{ maxHeight: "calc(92dvh - 20px)" }}>
              {/* Step indicators */}
              <div className="mb-5 flex items-center justify-center gap-2">
                {(["friend", "write", "preview"] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      step === s ? "bg-[#ff4d6d] text-white scale-110" : i < stepIndex ? "bg-[#ff4d6d]/30 text-white/80" : "bg-white/10 text-white/30"
                    }`}>
                      {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    {i < 2 && <div className="h-px w-8 bg-white/10" />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Pick friend */}
                {step === "friend" && (
                  <motion.div key="friend" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h2 className="mb-1 text-xl font-extrabold text-foreground">{"Выбери получателя"}</h2>
                    <p className="mb-5 text-sm text-muted-foreground">{"Кому отправить валентинку?"}</p>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {MOCK_FRIENDS.map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFriend(f.id)}
                          className={`tap-effect flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                            selectedFriend === f.id ? "ring-2 ring-[#ff4d6d] bg-white/10 scale-105" : "bg-white/5"
                          }`}
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: f.color }}>{f.initial}</div>
                          <span className="text-xs font-semibold text-foreground">{f.name}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => selectedFriend && setStep("write")}
                      disabled={!selectedFriend}
                      className="tap-effect flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}
                    >
                      {"Далее"}
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}

                {/* Write card */}
                {step === "write" && (
                  <motion.div key="write" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h2 className="mb-1 text-xl font-extrabold text-foreground">
                      {"Написать валентинку"}
                      {currentFriend && <span className="text-[#ff4d6d]">{" для "}{currentFriend.name}</span>}
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">{"Вырази свои чувства"}</p>

                    {/* Color picker */}
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{"Цвет открытки"}</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                        {CARD_COLORS.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedColor(c.id)}
                            className={`tap-effect shrink-0 flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all ${
                              selectedColor === c.id ? "ring-2 ring-white/40 scale-105" : "opacity-60"
                            }`}
                          >
                            <div className="h-10 w-14 rounded-lg" style={{ background: c.bg }} />
                            <span className="text-[10px] font-semibold text-foreground">{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Текст валентинки..."
                        rows={4}
                        maxLength={300}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-base text-foreground placeholder-white/30 outline-none focus:border-[#ff4d6d]/50 focus:ring-1 focus:ring-[#ff4d6d]/30 transition-colors"
                        style={{ fontSize: "16px" }}
                      />
                      <div className="mt-1 flex justify-end">
                        <span className={`text-[11px] ${message.length > 250 ? "text-[#ff4d6d]" : "text-muted-foreground"}`}>{message.length}/300</span>
                      </div>
                    </div>

                    {/* Anonymous toggle */}
                    <div className="mb-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <div>
                        <span className="text-sm font-semibold text-foreground">
                          {anonymous ? "Отправить анонимно" : "Показать мое имя"}
                        </span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {anonymous ? "Получатель не узнает отправителя" : "Твое имя будет видно"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnonymous(!anonymous)}
                        className={`relative h-7 w-12 rounded-full transition-colors ${anonymous ? "bg-[#ff4d6d]" : "bg-white/20"}`}
                        role="switch"
                        aria-checked={anonymous}
                        aria-label="Анонимная отправка"
                      >
                        <motion.div
                          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
                          animate={{ left: anonymous ? "calc(100% - 1.625rem)" : "0.125rem" }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep("friend")} className="tap-effect flex min-h-[52px] items-center justify-center rounded-xl bg-white/10 px-5 py-4 text-base font-bold text-white/60">
                        {"Назад"}
                      </button>
                      <button
                        type="button"
                        onClick={() => message.trim() && setStep("preview")}
                        disabled={!message.trim()}
                        className="tap-effect flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white disabled:opacity-30"
                        style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}
                      >
                        {"Предпросмотр"}
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Preview */}
                {step === "preview" && (
                  <motion.div key="preview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h2 className="mb-4 text-xl font-extrabold text-foreground">{"Предпросмотр открытки"}</h2>

                    <motion.div
                      initial={{ scale: 0.9, rotateX: 10 }}
                      animate={{ scale: 1, rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="mb-5 overflow-hidden rounded-2xl p-6 text-center"
                      style={{ background: currentColor.bg }}
                    >
                      <div className="mb-3 flex justify-center">
                        <Heart className="h-8 w-8 fill-white/30 text-white/30" />
                      </div>
                      <p className="text-base font-semibold text-white leading-relaxed mb-3 text-balance">{message}</p>
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="h-3 w-3 text-white/40" />
                        <p className="text-xs text-white/50">
                          {anonymous ? "От: Тайный поклонник" : "От: Ты"}
                          {currentFriend && <span>{" для "}{currentFriend.name}</span>}
                        </p>
                        <Sparkles className="h-3 w-3 text-white/40" />
                      </div>
                    </motion.div>

                    <AnimatePresence>
                      {sent && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 flex flex-col items-center gap-2 rounded-xl bg-[#ff4d6d]/10 p-4 text-center">
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 2, duration: 0.4 }}>
                            <Heart className="h-10 w-10 fill-[#ff4d6d] text-[#ff4d6d]" />
                          </motion.div>
                          <p className="text-lg font-extrabold text-foreground">{"Отправлено с любовью!"}</p>
                          <p className="text-sm text-muted-foreground">{"Твоя валентинка уже в пути"}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!sent && (
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep("write")} className="tap-effect flex min-h-[52px] items-center justify-center rounded-xl bg-white/10 px-5 py-4 text-base font-bold text-white/60">
                          {"Изменить"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={sending}
                          className="tap-effect flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white disabled:opacity-50"
                          style={{ background: "linear-gradient(135deg, #ff4d6d, #800f2f)" }}
                        >
                          {sending ? (
                            <span className="flex items-center gap-2">
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                                <Heart className="h-5 w-5" />
                              </motion.div>
                              {"Доставляем..."}
                            </span>
                          ) : (
                            <>
                              <Send className="h-5 w-5" />
                              {"Отправить валентинку"}
                            </>
                          )}
                        </button>
                      </div>
                    )}
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
