"use client"

import { useEffect, useState, type ReactNode } from "react"

// The seating chart goes live at 10:45 AM Eastern on Saturday, July 11, 2026.
// The -04:00 offset is EDT (Eastern Daylight Time), so this resolves to the
// same instant no matter what timezone the guest's device is set to.
const GO_LIVE = new Date("2026-07-11T10:45:00-04:00")

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function getTimeLeft(): TimeLeft {
  const total = GO_LIVE.getTime() - Date.now()
  const clamped = Math.max(total, 0)
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    total,
  }
}

export function CountdownGate({ children }: { children: ReactNode }) {
  // Start null so the server and first client render match (avoids hydration
  // mismatch), then compute the real value once mounted.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  // Before mount, render nothing to keep SSR/CSR output identical.
  if (timeLeft === null) return null

  // Time has arrived — reveal the seating app.
  if (timeLeft.total <= 0) return <>{children}</>

  return <CountdownScreen timeLeft={timeLeft} />
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
