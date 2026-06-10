"use client"

import { useMemo, useState } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Guest, SeatingData } from "@/lib/seating-types"

interface GuestSearchProps {
  data: SeatingData
  selectedGuest: Guest | null
  onSelect: (guest: Guest | null) => void
}

export function GuestSearch({ data, selectedGuest, onSelect }: GuestSearchProps) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return data.guests
      .filter((g) => `${g.firstName} ${g.lastName}`.toLowerCase().includes(q))
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .slice(0, 8)
  }, [query, data.guests])

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (selectedGuest) onSelect(null)
          }}
          placeholder="Search your name..."
          aria-label="Search for your name"
          className="h-12 rounded-full border-border bg-card pl-10 pr-10 text-base shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              onSelect(null)
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {query.trim() && !selectedGuest && (
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No guest found matching {`"${query}"`}.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(g)}
                    className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <span className="font-medium text-foreground">
                      {g.firstName} {g.lastName}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      Table {g.table}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export function GuestResultCard({
  guest,
  data,
  className,
}: {
  guest: Guest
  data: SeatingData
  className?: string
}) {
  const tablemates = data.guests.filter(
    (g) => g.table.toLowerCase() === guest.table.toLowerCase() && g.id !== guest.id,
  )

  return (
    <div className={cn("rounded-xl border border-accent/50 bg-accent/10 p-5", className)}>
      <p className="text-sm text-muted-foreground">Welcome,</p>
      <h3 className="font-serif text-2xl text-foreground">
        {guest.firstName} {guest.lastName}
      </h3>
      <div className="mt-3 flex items-center gap-2">
        <MapPin className="size-4 text-primary" />
        <span className="text-foreground">
          You are seated at <strong className="font-semibold">Table {guest.table}</strong>
        </span>
      </div>
      {tablemates.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Sitting with: {tablemates.map((g) => `${g.firstName} ${g.lastName}`).join(", ")}
        </p>
      )}
    </div>
  )
}
