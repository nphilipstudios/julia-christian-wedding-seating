"use client"

import { useRef, useState } from "react"
import { FloorPlan } from "@/components/floor-plan"
import { GuestSearch, GuestResultCard } from "@/components/guest-search"
import { SEATING_DATA } from "@/lib/seating-data"
import type { Guest } from "@/lib/seating-types"

export default function Page() {
  const data = SEATING_DATA
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const planRef = useRef<HTMLDivElement>(null)

  function handleSelect(guest: Guest | null) {
    setSelectedGuest(guest)
    if (guest) {
      // On phones the floor plan sits below the fold — bring it into view.
      requestAnimationFrame(() => {
        planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-5">
        {/* Header */}
        <header className="pt-8 text-center sm:pt-14">
          <p className="font-serif text-xs uppercase tracking-[0.25em] text-muted-foreground sm:text-sm sm:tracking-[0.3em]">
            The Wedding of
          </p>
          <h1 className="mt-2 text-balance font-serif text-4xl text-foreground sm:mt-3 sm:text-6xl">
            {data.eventTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            Find your seat for the celebration. Search your name below and we&apos;ll show you
            exactly where you&apos;re sitting.
          </p>
        </header>

        {/* Sticky search so it's always within thumb's reach on phones */}
        <div className="sticky top-0 z-30 -mx-4 mt-6 bg-background/90 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:mt-8 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <div className="mx-auto max-w-md">
            <GuestSearch data={data} selectedGuest={selectedGuest} onSelect={handleSelect} />
          </div>
        </div>

        {/* Result card */}
        <div className="mx-auto mt-6 max-w-md">
          {selectedGuest ? (
            <GuestResultCard guest={selectedGuest} data={data} />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your table will be highlighted on the floor plan once you select your name.
              </p>
            </div>
          )}
        </div>

        {/* Floor plan */}
        <div ref={planRef} className="mx-auto mt-6 max-w-2xl scroll-mt-20">
          <FloorPlan data={data} highlightTable={selectedGuest?.table ?? null} />

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-secondary ring-1 ring-border" /> Table
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-accent ring-1 ring-accent" /> Your table
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-primary" /> Head table
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
