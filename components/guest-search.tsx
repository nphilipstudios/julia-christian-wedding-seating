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

// Common titles/honorifics/suffixes that people may or may not include when
// searching. Both abbreviated and spelled-out forms are ignored so a guest
// finds themselves whether or not they type a title (e.g. "Dr.", "Doctor",
// "Rev.", "Reverend", "Achen").
const IGNORED_TOKENS = new Set([
  "mr", "mrs", "ms", "miss", "mx",
  "dr", "doctor",
  "rev", "reverend", "revd",
  "fr", "father", "achen", "achan",
  "pr", "pastor",
  "prof", "professor",
  "sr", "jr", "sir", "aunty", "auntie", "uncle",
  "the", "of", "and",
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

// Title groups: each variant maps to the full set of spellings that belong to
// the same title. Searching any of these on its own lists everyone with that
// title (e.g. typing "dr" or "dr." shows all doctors, "rev" shows reverends).
const TITLE_GROUPS: string[][] = [
  ["dr", "doctor"],
  ["rev", "reverend", "revd"],
  ["fr", "father", "achen", "achan"],
  ["pastor"],
  ["prof", "professor"],
  ["mr"],
  ["mrs"],
  ["ms", "miss"],
]

/**
 * If the entire query is just a title (e.g. "dr", "dr.", "reverend"), return
 * the full variant set for that title so we can list everyone who has it.
 * Otherwise returns null and the normal name search runs.
 */
function queryTitleVariants(query: string): string[] | null {
  const cleaned = query.toLowerCase().replace(/[^a-z]/g, "")
  if (!cleaned) return null
  return TITLE_GROUPS.find((variants) => variants.includes(cleaned)) ?? null
}

/** True when a guest's name carries one of the given title variants. */
function guestHasTitle(guest: Guest, variants: string[]): boolean {
  const nameTokens = `${guest.firstName} ${guest.lastName}`
    .toLowerCase()
    .replace(/[.]/g, " ")
    .split(/\s+/)
  return variants.some((v) => nameTokens.includes(v))
}

export function GuestSearch({ data, selectedGuest, onSelect }: GuestSearchProps) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    if (!query.trim()) return []
    // Title-only search: "dr" / "dr." lists all doctors, "rev" all reverends, etc.
    const titleVariants = queryTitleVariants(query)
    if (titleVariants) {
      return data.guests
        .filter((g) => guestHasTitle(g, titleVariants))
        .sort((a, b) => a.lastName.localeCompare(b.lastName))
        .slice(0, 50)
    }
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
            <>
              {/* Count header — tells guests how many matches and that the list scrolls */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-secondary/60 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur">
                <span>
                  {results.length} {results.length === 1 ? "match" : "matches"}
                </span>
                {results.length > 6 && <span className="text-[11px]">Scroll for more</span>}
              </div>
              <ul
                className="max-h-[60vh] divide-y divide-border overflow-y-auto overflow-x-hidden overscroll-contain sm:max-h-96"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {results.map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(g)}
                      className="flex w-full items-center justify-between gap-2 px-4 py-4 text-left transition-colors hover:bg-secondary active:bg-secondary sm:py-3"
                    >
                      <span className="font-medium leading-snug text-foreground">
                        {g.firstName} {g.lastName}
                      </span>
                      <span className="flex shrink-0 flex-col items-end text-sm text-muted-foreground">
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
            </>
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
