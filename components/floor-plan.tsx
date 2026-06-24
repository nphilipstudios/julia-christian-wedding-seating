"use client"

import { cn } from "@/lib/utils"
import type { SeatingData } from "@/lib/seating-types"

interface FloorPlanProps {
  data: SeatingData
  /** label of the table to highlight, if any */
  highlightTable?: string | null
  /** when in edit mode, clicking a table calls this */
  onTableClick?: (tableId: string) => void
  selectedTableId?: string | null
}

const fixtureStyles: Record<string, string> = {
  stage: "bg-primary text-primary-foreground",
  dancefloor: "border-2 border-dashed border-primary/40 bg-primary/5 text-primary",
  entrance: "bg-secondary text-secondary-foreground",
  bar: "bg-muted text-muted-foreground border border-border",
  backdrop: "bg-muted-foreground/30 text-foreground border border-border",
  dj: "bg-foreground text-background",
  photobooth: "rounded-full border-2 border-border bg-muted text-muted-foreground",
}

export function FloorPlan({
  data,
  highlightTable,
  onTableClick,
  selectedTableId,
}: FloorPlanProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      style={{ aspectRatio: "985 / 854" }}
      role="img"
      aria-label="Venue floor plan"
    >
      {/* Venue wall outline */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-muted-foreground/50"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points="40.6,10.5 79.4,11.2 97.7,24.6 97.3,31.6 92.9,36.5 92.9,52.7 70.1,70.3 56.9,90.2 17.8,86.7 7.1,62.6 21.8,34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Fixtures */}
      {data.fixtures.map((f) => (
        <div
          key={f.id}
          className={cn(
            "absolute flex items-center justify-center rounded-md text-center text-[10px] font-medium uppercase tracking-wide sm:text-xs",
            fixtureStyles[f.type],
          )}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.width}%`,
            height: `${f.height}%`,
            transform: `translate(-50%, -50%) rotate(${f.rotation ?? 0}deg)`,
          }}
        >
          {f.label}
        </div>
      ))}

      {/* Tables */}
      {data.tables.map((t) => {
        const isHighlighted =
          highlightTable != null &&
          t.label.toLowerCase() === highlightTable.toLowerCase()
        const isSelected = selectedTableId === t.id
        const interactive = !!onTableClick

        return (
          <button
            key={t.id}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={interactive ? () => onTableClick?.(t.id) : undefined}
            aria-label={`Table ${t.label}`}
            className={cn(
              "absolute flex items-center justify-center border text-[7px] font-semibold leading-none transition-all duration-300 sm:text-[9px]",
              t.shape === "round" ? "rounded-full" : "rounded-md",
              interactive && "cursor-pointer hover:ring-2 hover:ring-accent",
              isHighlighted
                ? "z-20 scale-[1.8] border-accent bg-accent text-accent-foreground shadow-lg ring-2 ring-accent/50"
                : "border-border bg-secondary text-secondary-foreground",
              isSelected && !isHighlighted && "ring-2 ring-primary",
            )}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: t.shape === "round" ? "4.6%" : "7%",
              height: t.shape === "round" ? "5.3%" : "4.5%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="leading-none">{t.label}</span>
            {isHighlighted && (
              <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-accent/40" />
            )}
          </button>
        )
      })}
    </div>
  )
}
