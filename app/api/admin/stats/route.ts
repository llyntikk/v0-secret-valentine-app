import { NextResponse } from "next/server"

// GET /api/admin/stats - Admin dashboard statistics
export async function GET() {
  return NextResponse.json({
    totalUsers: 1247,
    sentValentines: 3891,
    activeToday: 312,
    newSubscriptions: 89,
  })
}
