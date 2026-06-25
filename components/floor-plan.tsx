"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { SeatingData } from "@/lib/seating-types"

interface FloorPlanProps {
  data: SeatingData
  /** label of the table to highlight, if any */
  highlightTable?: string | null
}

export function FloorPlan({ data, highlightTable }: FloorPlanProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      style={{ aspectRatio: "1456 / 1138" }}
      role="img"
      aria-label="Venue floor plan"
    >
      {/* Real venue layout as the background */}
      <Image
        src="/venue-floor-plan.png"
        alt="Reception venue floor plan with numbered tables, dance floor, backdrop and DJ booth"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-contain"
      />

      {/* Highlight markers — invisible until the guest's table is matched */}
      {data.tables.map((t) => {
        const isHighlighted =
          highlightTable != null &&
          t.label.toLowerCase() === highlightTable.toLowerCase()

        if (!isHighlighted) return null

        return (
          <div
            key={t.id}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            {/* pulsing ring around the matched table */}
            <span className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/40 sm:size-11" />
            <span
              className={cn(
                "absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full",
                "border-[3px] border-accent shadow-lg sm:size-10",
              )}
            />
            {/* table number badge above the ring */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[180%] whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground shadow sm:text-xs">
              Table {t.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
