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
      style={{ aspectRatio: "1226 / 1052" }}
      role="img"
      aria-label="Venue floor plan"
    >
      {/*
        Background image is public/venue-floor-plan.png (1318 x 1156). The inner
        frame is scaled up and inset slightly (left/top offset) so the venue
        keeps padding from the card border, while the empty service wing right of
        the photo booth and the floor below table 39 are cropped off. Image and
        table markers share this frame so highlights stay aligned.
      */}
      <div
        className="absolute"
        style={{ left: "1.5%", top: "1.5%", width: "107.53%", height: "109.89%" }}
      >
        {/* Real venue layout (walls, dance floor, backdrop, DJ) as the background */}
        <Image
          src="/venue-floor-plan.png"
          alt="Reception venue floor plan with dance floor, backdrop and DJ booth"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-contain"
        />

        {/* Clean table circles, drawn on top to replace the printed chair-tables */}
        {data.tables.map((t) => {
          const isHighlighted =
            highlightTable != null &&
            t.label.toLowerCase() === highlightTable.toLowerCase()

          return (
            <div
              key={t.id}
              className={cn(
                "absolute flex aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[7px] font-semibold leading-none transition-all duration-300 sm:text-[9px]",
                isHighlighted
                  ? "z-20 scale-[1.7] border-accent bg-accent text-accent-foreground shadow-lg ring-2 ring-accent/50"
                  : "z-10 border-border bg-secondary text-secondary-foreground",
              )}
              style={{ left: `${t.x}%`, top: `${t.y}%`, width: "4%" }}
            >
              {t.label}

              {isHighlighted && (
                <>
                  {/* pulsing ring around the matched table */}
                  <span className="pointer-events-none absolute -inset-1 animate-ping rounded-full bg-accent/40" />
                  {/* table number badge above the ring */}
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-1.5 py-0.5 text-[6px] font-semibold text-accent-foreground shadow sm:text-[8px]">
                    Table {t.label}
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
