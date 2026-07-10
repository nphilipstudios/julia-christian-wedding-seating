import { NextResponse } from "next/server"

// Authoritative go-live moment: 12:00 AM EDT on Friday, July 10, 2026.
// July 10, 2026 is within US Daylight Time, so the offset is UTC-4 (-04:00).
const TARGET_MS = new Date("2026-07-10T00:00:00-04:00").getTime()

// Always evaluate on the server at request time — never cached — so a guest's
// device clock cannot reveal the seating chart early.
export const dynamic = "force-dynamic"
export const revalidate = 0

export function GET() {
  const now = Date.now()
  const remainingMs = Math.max(0, TARGET_MS - now)
  return NextResponse.json(
    {
      live: now >= TARGET_MS,
      remainingMs,
      targetMs: TARGET_MS,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    },
  )
}
