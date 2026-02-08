"use client"

import React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, Heart, Activity, Bell, Trash2, Pencil, Send, Lock, Unlock, LogOut, Shield, X, Check,
} from "lucide-react"
import { toast } from "sonner"

/* ============ MOCK DATA ============ */
interface Valentine {
  id: string
  message: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  isAnonymous: boolean
  createdAt: string
}

const INITIAL_VALENTINES: Valentine[] = [
  { id: "v1", message: "Ты делаешь каждый день особенным!", senderId: "u1", senderName: "Аня", recipientId: "u2", recipientName: "Дима", isAnonymous: true, createdAt: "2026-02-10" },
  { id: "v2", message: "Я давно хотел тебе это сказать...", senderId: "u3", senderName: "Никита", recipientId: "u4", recipientName: "Катя", isAnonymous: false, createdAt: "2026-02-11" },
  { id: "v3", message: "С Днём Святого Валентина! Ты лучший!", senderId: "u5", senderName: "Мария", recipientId: "u1", recipientName: "Аня", isAnonymous: true, createdAt: "2026-02-12" },
  { id: "v4", message: "Ты заслуживаешь всего самого лучшего на свете!", senderId: "u2", senderName: "Дима", recipientId: "u5", recipientName: "Мария", isAnonymous: false, createdAt: "2026-02-12" },
  { id: "v5", message: "Каждый раз, когда я тебя вижу, моё сердце бьётся быстрее.", senderId: "u4", senderName: "Катя", recipientId: "u3", recipientName: "Никита", isAnonymous: true, createdAt: "2026-02-13" },
]

const STATS = [
  { label: "Всего пользователей", value: "1,247", icon: Users, color: "#800f2f" },
  { label: "Отправлено валентинок", value: "3,891", icon: Heart, color: "#ff4d6d" },
  { label: "Активны сегодня", value: "312", icon: Activity, color: "#f57c00" },
  { label: "Новых подписок", value: "89", icon: Bell, color: "#1565c0" },
]

/* ============ LOGIN ============ */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login === "admin" && password === "admin") {
      onLogin()
    } else {
      setError("Неверный логин или пароль")
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}>
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">{"Панель Администратора"}</h1>
          <p className="text-sm text-muted-foreground text-center">{"Войдите для доступа к панели управления"}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={login}
            onChange={e => { setLogin(e.target.value); setError("") }}
            placeholder="Логин"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-foreground placeholder-white/30 outline-none focus:border-[#ff4d6d]/50"
            style={{ fontSize: "16px" }}
          />
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError("") }}
            placeholder="Пароль"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-foreground placeholder-white/30 outline-none focus:border-[#ff4d6d]/50"
            style={{ fontSize: "16px" }}
          />
          {error && <p className="text-sm text-[#ff4d6d] font-semibold">{error}</p>}
          <button
            type="submit"
            className="tap-effect flex min-h-[48px] w-full items-center justify-center rounded-xl py-3 text-base font-bold text-white"
            style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}
          >
            {"Войти"}
          </button>
          <p className="text-center text-xs text-muted-foreground mt-1">{"Подсказка: admin / admin"}</p>
        </form>
      </motion.div>
    </div>
  )
}

/* ============ EDIT MODAL ============ */
function EditModal({ valentine, onSave, onClose }: { valentine: Valentine; onSave: (id: string, message: string) => void; onClose: () => void }) {
  const [text, setText] = useState(valentine.message)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-md rounded-2xl p-5"
        style={{ background: "#140008", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button type="button" onClick={onClose} className="tap-effect absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10" aria-label="Закрыть">
          <X className="h-4 w-4 text-white/60" />
        </button>
        <h3 className="text-lg font-extrabold text-foreground mb-1">{"Изменить валентинку"}</h3>
        <p className="text-xs text-muted-foreground mb-4">ID: {valentine.id}</p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-foreground placeholder-white/30 outline-none focus:border-[#ff4d6d]/50"
          style={{ fontSize: "16px" }}
        />
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={onClose} className="tap-effect flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold text-white/60">{"Отмена"}</button>
          <button
            type="button"
            onClick={() => { onSave(valentine.id, text); onClose() }}
            className="tap-effect flex-1 rounded-xl py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}
          >
            {"Сохранить"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ============ DELETE CONFIRM ============ */
function DeleteConfirm({ id, onConfirm, onClose }: { id: string; onConfirm: (id: string) => void; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-sm rounded-2xl p-5 text-center"
        style={{ background: "#140008", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d6d]/10">
          <Trash2 className="h-6 w-6 text-[#ff4d6d]" />
        </div>
        <h3 className="text-lg font-extrabold text-foreground mb-1">{"Удалить валентинку?"}</h3>
        <p className="text-sm text-muted-foreground mb-5">{"Это действие нельзя отменить"}</p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="tap-effect flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold text-white/60">{"Отмена"}</button>
          <button
            type="button"
            onClick={() => { onConfirm(id); onClose() }}
            className="tap-effect flex-1 rounded-xl bg-[#ff4d6d] py-3 text-sm font-bold text-white"
          >
            {"Удалить"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ============ ADMIN DASHBOARD ============ */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [valentines, setValentines] = useState<Valentine[]>(INITIAL_VALENTINES)
  const [editingValentine, setEditingValentine] = useState<Valentine | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [broadcastText, setBroadcastText] = useState("")
  const [allUnlocked, setAllUnlocked] = useState(false)

  const handleDelete = useCallback((id: string) => {
    setValentines(prev => prev.filter(v => v.id !== id))
    toast.success("Валентинка удалена")
  }, [])

  const handleEdit = useCallback((id: string, message: string) => {
    setValentines(prev => prev.map(v => v.id === id ? { ...v, message } : v))
    toast.success("Валентинка изменена")
  }, [])

  const handleBroadcast = useCallback(async () => {
    if (!broadcastText.trim()) { toast.error("Введите текст рассылки"); return }
    // Mock: calling Bot API
    toast.success("Рассылка отправлена!", { description: `Уведомление доставлено всем пользователям` })
    setBroadcastText("")
  }, [broadcastText])

  const handleUnlockAll = useCallback(() => {
    setAllUnlocked(!allUnlocked)
    toast.success(allUnlocked ? "Валентинки снова заблокированы" : "Все валентинки разблокированы!")
  }, [allUnlocked])

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4" style={{ background: "rgba(128,15,47,0.1)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}>
            <Shield className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-extrabold text-foreground">{"Панель Администратора"}</h1>
        </div>
        <button type="button" onClick={onLogout} className="tap-effect flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-muted-foreground">
          <LogOut className="h-3.5 w-3.5" />
          {"Выйти"}
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 glass-strong"
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${stat.color}20` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Unlock all toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between rounded-2xl p-4 glass-strong">
          <div className="flex items-center gap-3">
            {allUnlocked ? <Unlock className="h-5 w-5 text-green-400" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
            <div>
              <p className="text-sm font-bold text-foreground">{"Разблокировать все валентинки"}</p>
              <p className="text-xs text-muted-foreground">{allUnlocked ? "Все открытки доступны" : "Открытки заблокированы до 14 февраля"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnlockAll}
            className={`relative h-7 w-12 rounded-full transition-colors ${allUnlocked ? "bg-green-500" : "bg-white/20"}`}
            role="switch"
            aria-checked={allUnlocked}
          >
            <motion.div
              className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
              animate={{ left: allUnlocked ? "calc(100% - 1.625rem)" : "0.125rem" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </motion.div>

        {/* Broadcast tool */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="rounded-2xl p-4 glass-strong">
          <div className="flex items-center gap-2 mb-3">
            <Send className="h-4 w-4 text-[#ff4d6d]" />
            <h2 className="text-base font-extrabold text-foreground">{"Рассылка уведомлений"}</h2>
          </div>
          <textarea
            value={broadcastText}
            onChange={e => setBroadcastText(e.target.value)}
            placeholder="Текст уведомления для всех пользователей..."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-foreground placeholder-white/30 outline-none focus:border-[#ff4d6d]/50 mb-3"
            style={{ fontSize: "16px" }}
          />
          <button
            type="button"
            onClick={handleBroadcast}
            className="tap-effect flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #800f2f, #c9184a)" }}
          >
            <Send className="h-4 w-4" />
            {"Отправить рассылку"}
          </button>
        </motion.div>

        {/* Valentines table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-2xl overflow-hidden glass-strong">
          <div className="flex items-center gap-2 p-4 border-b border-white/5">
            <Heart className="h-4 w-4 text-[#ff4d6d]" />
            <h2 className="text-base font-extrabold text-foreground">{"Все валентинки"}</h2>
            <span className="ml-auto text-xs text-muted-foreground">{valentines.length} {"записей"}</span>
          </div>

          {/* Mobile-friendly card list */}
          <div className="flex flex-col divide-y divide-white/5">
            {valentines.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex flex-col gap-2 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{v.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${v.isAnonymous ? "bg-[#ff4d6d]/10 text-[#ff4d6d]" : "bg-green-500/10 text-green-400"}`}>
                        {v.isAnonymous ? "Анонимно" : "Открыто"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">{v.message}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button type="button" onClick={() => setEditingValentine(v)} className="tap-effect flex h-9 w-9 items-center justify-center rounded-lg bg-white/5" aria-label="Изменить">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button type="button" onClick={() => setDeletingId(v.id)} className="tap-effect flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff4d6d]/10" aria-label="Удалить">
                      <Trash2 className="h-3.5 w-3.5 text-[#ff4d6d]" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{"От: "}{v.isAnonymous ? "Скрыто" : v.senderName} ({v.senderId})</span>
                  <span>{"Кому: "}{v.recipientName} ({v.recipientId})</span>
                  <span className="ml-auto">{v.createdAt}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {valentines.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">{"Нет валентинок"}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingValentine && <EditModal valentine={editingValentine} onSave={handleEdit} onClose={() => setEditingValentine(null)} />}
        {deletingId && <DeleteConfirm id={deletingId} onConfirm={handleDelete} onClose={() => setDeletingId(null)} />}
      </AnimatePresence>
    </div>
  )
}

/* ============ MAIN ============ */
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)

  return authenticated
    ? <AdminDashboard onLogout={() => setAuthenticated(false)} />
    : <AdminLogin onLogin={() => setAuthenticated(true)} />
}
