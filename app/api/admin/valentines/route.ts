import { NextResponse } from "next/server"

// GET /api/admin/valentines - List all valentines for admin
const MOCK_VALENTINES = [
  { id: "v1", message: "Ты делаешь каждый день особенным!", senderId: "u1", senderName: "Аня", recipientId: "u2", recipientName: "Дима", isAnonymous: true, createdAt: "2026-02-10" },
  { id: "v2", message: "Я давно хотел тебе это сказать...", senderId: "u3", senderName: "Никита", recipientId: "u4", recipientName: "Катя", isAnonymous: false, createdAt: "2026-02-11" },
  { id: "v3", message: "С Днём Святого Валентина! Ты лучший!", senderId: "u5", senderName: "Мария", recipientId: "u1", recipientName: "Аня", isAnonymous: true, createdAt: "2026-02-12" },
  { id: "v4", message: "Ты заслуживаешь всего самого лучшего!", senderId: "u2", senderName: "Дима", recipientId: "u5", recipientName: "Мария", isAnonymous: false, createdAt: "2026-02-12" },
  { id: "v5", message: "Каждый раз, когда я тебя вижу, моё сердце бьётся быстрее.", senderId: "u4", senderName: "Катя", recipientId: "u3", recipientName: "Никита", isAnonymous: true, createdAt: "2026-02-13" },
]

export async function GET() {
  return NextResponse.json({ valentines: MOCK_VALENTINES })
}
