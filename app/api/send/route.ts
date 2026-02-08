import { NextResponse } from "next/server"

// Mock bot token for simulating Telegram Bot API notifications
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8432611298:AAHzIGbkSjje84ZwwmlN79rE_HpzDPP81J0"

// POST /api/send - Send a new Valentine card
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipientId, message, isAnonymous, cardColor } = body

    if (!recipientId || !message?.trim()) {
      return NextResponse.json(
        { error: "recipientId and message are required" },
        { status: 400 }
      )
    }

    // Mock: create valentine record
    const valentine = {
      id: `v_${Date.now()}`,
      recipientId,
      message: message.trim(),
      isAnonymous: isAnonymous ?? true,
      cardColor: cardColor || "#800f2f",
      createdAt: new Date().toISOString(),
    }

    // Mock: simulate sending Telegram notification via Bot API
    // In production this would be:
    // await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ chat_id: recipientId, text: "Тебе пришла новая валентинка!" }),
    // })

    console.log(`[Mock Bot API] Token: ${TELEGRAM_BOT_TOKEN.slice(0, 10)}... Sending notification to ${recipientId}`)

    return NextResponse.json({ success: true, valentine })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
