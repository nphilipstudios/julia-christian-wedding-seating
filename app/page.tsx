"use client"

import { useState } from "react"
import { Settings, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloorPlan } from "@/components/floor-plan"
import { GuestSearch, GuestResultCard } from "@/components/guest-search"
import { ManagePanel } from "@/components/manage-panel"
import { useSeatingStore } from "@/lib/use-seating-store"
import type { Guest } from "@/lib/seating-types"

export default function Page() {
  const { data, loaded, persist, reset } = useSeatingStore()
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [managing, setManaging] = useState(false)

  if (!loaded || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    )
  }

  if (managing) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-5 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-serif text-2xl text-foreground">Manage seating</h1>
            <Button variant="outline" onClick={() => setManaging(false)}>
              <ArrowLeft className="size-4" /> Back to search
            </Button>
          </div>
          <ManagePanel data={data} onChange={persist} onReset={reset} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
        {/* Header */}
        <header className="relative text-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setManaging(true)}
            aria-label="Manage seating chart"
            className="absolute right-0 top-0 text-muted-foreground"
          >
            <Settings className="size-5" />
          </Button>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
            The Wedding of
          </p>
          <h1 className="mt-3 text-balance font-serif text-5xl text-foreground sm:text-6xl">
            {data.eventTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Find your seat for the celebration. Search your name below and we&apos;ll show you
            exactly where you&apos;re sitting.
          </p>
        </header>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-md">
          <GuestSearch data={data} selectedGuest={selectedGuest} onSelect={setSelectedGuest} />
        </div>

        {/* Result + Floor plan */}
        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {selectedGuest ? (
              <GuestResultCard guest={selectedGuest} data={data} />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your table will be highlighted on the floor plan once you select your name.
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
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

          <div className="lg:col-span-3">
            <FloorPlan data={data} highlightTable={selectedGuest?.table ?? null} />
          </div>
        </div>
      </div>
    </main>
  )
}
