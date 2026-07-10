"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function msToTimeLeft(ms: number): TimeLeft {
  const clamped = Math.max(ms, 0)
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  }
}

// How often to re-check with the server so the gate stays authoritative even
// if the device clock is wrong or has been manually changed.
const RESYNC_INTERVAL_MS = 30_000

export function CountdownGate({ children }: { children: ReactNode }) {
  // null = still loading the first authoritative server response.
  const [live, setLive] = useState<boolean | null>(null)
  const [remainingMs, setRemainingMs] = useState<number | null>(null)

  // Anchor: the server's remaining time + the device timestamp captured at that
  // moment. We only measure ELAPSED time from the anchor (not wall-clock), so
  // changing the device clock cannot unlock the page early.
  const anchorRef = useRef<{ remaining: number; at: number } | null>(null)

  const sync = useCallback(async () => {
    try {
      const res = await fetch("/api/go-live", { cache: "no-store" })
      if (!res.ok) throw new Error("bad status")
      const data: { live: boolean; remainingMs: number } = await res.json()
      anchorRef.current = { remaining: data.remainingMs, at: Date.now() }
      setLive(data.live)
      setRemainingMs(data.remainingMs)
    } catch {
      // On network failure, stay gated if we never got an answer; otherwise
      // keep whatever we last knew.
      setLive((prev) => (prev === null ? false : prev))
    }
  }, [])

  useEffect(() => {
    sync()
    const resync = setInterval(sync, RESYNC_INTERVAL_MS)

    // Local 1s tick derived from the last server anchor.
    const tick = setInterval(() => {
      const anchor = anchorRef.current
      if (!anchor) return
      const elapsed = Date.now() - anchor.at
      const left = Math.max(0, anchor.remaining - elapsed)
      setRemainingMs(left)
      // When the local countdown hits zero, confirm with the server rather
      // than trusting the local tick to flip the gate.
      if (left <= 0) sync()
    }, 1000)

    // Re-sync when the tab regains focus (covers long sleeps and clock drift).
    const onVisible = () => {
      if (document.visibilityState === "visible") sync()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearInterval(resync)
      clearInterval(tick)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [sync])

  // Loading the first authoritative response — render a neutral loader so we
  // never flash either the countdown or the chart before we know the truth.
  if (live === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="sr-only">Loading</span>
        <div
          className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
          aria-hidden="true"
        />
      </div>
    )
  }

  // Time has arrived (per the server) — reveal the seating app.
  if (live) return <>{children}</>

  return <CountdownScreen timeLeft={msToTimeLeft(remainingMs ?? 0)} />
}

function CountdownScreen({ timeLeft }: { timeLeft: TimeLeft }) {
  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="font-serif text-xs uppercase tracking-[0.25em] text-muted-foreground sm:text-sm sm:tracking-[0.3em]">
          The Wedding of
        </p>
        <h1 className="mt-2 text-balance font-serif text-4xl text-foreground sm:mt-3 sm:text-6xl">
          Julia &amp; Christian
        </h1>

        <div className="mx-auto mt-8 h-px w-16 bg-border sm:mt-10" />

        <p className="mx-auto mt-8 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Our seating chart will be available on the morning of the celebration.
          Please check back when the countdown reaches zero.
        </p>

        <div
          className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-2 sm:mt-10 sm:gap-4"
          role="timer"
          aria-live="off"
          aria-label="Time until the seating chart opens"
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center rounded-xl border border-border bg-card py-4 sm:py-6"
            >
              <span className="font-serif text-3xl tabular-nums text-foreground sm:text-5xl">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:mt-2 sm:text-xs sm:tracking-[0.2em]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mt-10">
          Saturday, July 11, 2026 &middot; 10:45 AM
        </p>
      </div>
    </main>
  )
}
