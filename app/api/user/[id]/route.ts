import { NextResponse } from "next/server"

// GET /api/user/[id] - Get user's received cards
const MOCK_CARDS = [
  {
    id: "c1",
    senderName: "Аня",
    message: "Ты делаешь каждый день особенным!",
    unlocksAt: "2026-02-14T00:00:00Z",
    color: "#800f2f",
    isAnonymous: true,
  },
  {
    id: "c2",
    senderName: "Дима",
    message: "Я давно хотел тебе это сказать...",
    unlocksAt: "2026-02-14T00:00:00Z",
    color: "#ff4d6d",
    isAnonymous: false,
  },
]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return NextResponse.json({
    user: {
      id,
      name: "Пользователь",
      referralLink: `t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || "secretvalentinebot"}/app?ref=${id}`,
      heartsCount: MOCK_CARDS.length,
    },
    cards: MOCK_CARDS,
  })
}
