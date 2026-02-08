import { NextResponse } from "next/server"

// DELETE /api/admin/valentines/[id] - Delete a valentine
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Mock: in production, delete from database
  console.log(`[Mock] Deleting valentine ${id}`)
  return NextResponse.json({ success: true, deletedId: id })
}

// PUT /api/admin/valentines/[id] - Edit a valentine message
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { message } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 })
    }

    // Mock: in production, update in database
    console.log(`[Mock] Updating valentine ${id} with message: ${message}`)
    return NextResponse.json({
      success: true,
      valentine: { id, message: message.trim(), updatedAt: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
