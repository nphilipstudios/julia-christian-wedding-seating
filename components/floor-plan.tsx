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
      style={{ aspectRatio: "930 / 735" }}
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
          points="37.6,1.6 93.3,21.5 94.4,28.6 97.3,29.7 93.3,52.8 88.7,63.3 66.7,99.6 12.9,99.6 4.1,84.4 1.6,72.8"
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
              width: t.shape === "round" ? "5%" : "7%",
              height: t.shape === "round" ? "5.6%" : "4.5%",
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
