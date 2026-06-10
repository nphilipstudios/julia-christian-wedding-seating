"use client"

import { useCallback, useEffect, useState } from "react"
import { SAMPLE_DATA, type SeatingData, type VenueTable } from "./seating-types"

const STORAGE_KEY = "wedding-seating-data-v1"

/** Arrange table labels into a tidy grid of round tables on the floor plan. */
export function autoLayoutTables(tableLabels: string[]): VenueTable[] {
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(tableLabels.length))))
  const rows = Math.ceil(tableLabels.length / cols)

  // Usable area avoids head table (top) and entrance (bottom)
  const top = 30
  const bottom = 88
  const left = 14
  const right = 78

  return tableLabels.map((label, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = cols === 1 ? (left + right) / 2 : left + (col * (right - left)) / (cols - 1)
    const y = rows === 1 ? (top + bottom) / 2 : top + (row * (bottom - top)) / (rows - 1)
    return {
      id: `t-${label}-${i}`,
      label,
      shape: "round" as const,
      x: Math.round(x),
      y: Math.round(y),
      seats: 8,
    }
  })
}

export function useSeatingStore() {
  const [data, setData] = useState<SeatingData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setData(JSON.parse(raw))
      } else {
        setData(SAMPLE_DATA)
      }
    } catch {
      setData(SAMPLE_DATA)
    }
    setLoaded(true)
  }, [])

  const persist = useCallback((next: SeatingData) => {
    setData(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore quota / private mode errors
    }
  }, [])

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setData(SAMPLE_DATA)
  }, [])

  return { data, loaded, persist, reset }
}
