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

// Common titles/suffixes that people may or may not include when searching.
const IGNORED_TOKENS = new Set([
  "mr", "mrs", "ms", "miss", "dr", "rev", "fr", "pr", "pastor", "prof",
  "sr", "jr", "the", "of", "and",
])

/**
 * Normalize a name or query into comparable tokens. This is intentionally
 * forgiving so guests find themselves no matter how they type it:
 * - parentheses are kept as words (e.g. "(Sabu)" -> "sabu") so nicknames work
 * - periods/commas/apostrophes/hyphens become spaces ("C.V." -> "c v")
 * - titles like "Rev." / "Dr." are dropped so they're optional
 */
function normalizeTokens(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[.,'`-]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !IGNORED_TOKENS.has(t))
}

/**
 * Fuzzy match: every query token must be the prefix of some name token
 * (order-independent, so "mathew cv" works), OR the punctuation-free query
 * is a substring of the punctuation-free name (so "cvmathew" works too).
 * This makes middle initials, periods, and parentheses all optional.
 */
function matchesGuest(query: string, guest: Guest): boolean {
  const qTokens = normalizeTokens(query)
  if (qTokens.length === 0) return false
  const nTokens = normalizeTokens(`${guest.firstName} ${guest.lastName}`)
  const tokenMatch = qTokens.every((qt) => nTokens.some((nt) => nt.startsWith(qt)))
  if (tokenMatch) return true
  return nTokens.join("").includes(qTokens.join(""))
}

/**
 * Even table numbers are the Groom's side, odd numbers are the Bride's side.
 * Returns null for any non-numeric table label.
 */
function getSide(table: string): "Groom's side" | "Bride's side" | null {
  const n = Number.parseInt(table, 10)
  if (Number.isNaN(n)) return null
  return n % 2 === 0 ? "Groom's side" : "Bride's side"
}

export function GuestSearch({ data, selectedGuest, onSelect }: GuestSearchProps) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    return data.guests
      .filter((g) => matchesGuest(query, g))
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
                    <span className="flex flex-col items-end text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        Table {g.table}
                      </span>
                      {getSide(g.table) && (
                        <span className="text-xs">{getSide(g.table)}</span>
                      )}
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
  const side = getSide(guest.table)

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
      {side && (
        <span className="mt-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          {side}
        </span>
      )}
      {tablemates.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Sitting with: {tablemates.map((g) => `${g.firstName} ${g.lastName}`).join(", ")}
        </p>
      )}
    </div>
  )
}
