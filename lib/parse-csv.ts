import type { Guest } from "./seating-types"

/**
 * Parse CSV text into guests. Supports headers in any order.
 * Recognized columns (case-insensitive):
 *  - first name / firstname / first
 *  - last name / lastname / last
 *  - name / full name  (split on first space if no separate first/last)
 *  - table / table number / table no / seat
 */
export function parseGuestsCsv(text: string): { guests: Guest[]; tables: string[]; error?: string } {
  const rows = splitRows(text)
  if (rows.length === 0) {
    return { guests: [], tables: [], error: "The file appears to be empty." }
  }

  const header = rows[0].map((h) => h.trim().toLowerCase())
  const idx = {
    first: findCol(header, ["first name", "firstname", "first"]),
    last: findCol(header, ["last name", "lastname", "last", "surname"]),
    name: findCol(header, ["name", "full name", "guest", "guest name"]),
    table: findCol(header, ["table", "table number", "table no", "table #", "tablenumber", "seat"]),
  }

  if (idx.table === -1) {
    return {
      guests: [],
      tables: [],
      error: 'No "table" column found. Include a column named "Table" with the table number.',
    }
  }
  if (idx.first === -1 && idx.name === -1) {
    return {
      guests: [],
      tables: [],
      error: 'No name column found. Include "Name" or "First Name" / "Last Name" columns.',
    }
  }

  const guests: Guest[] = []
  const tableSet = new Set<string>()

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i]
    if (cells.every((c) => c.trim() === "")) continue

    let firstName = ""
    let lastName = ""

    if (idx.first !== -1) {
      firstName = (cells[idx.first] ?? "").trim()
      lastName = idx.last !== -1 ? (cells[idx.last] ?? "").trim() : ""
    } else {
      const full = (cells[idx.name] ?? "").trim()
      const parts = full.split(/\s+/)
      firstName = parts.shift() ?? ""
      lastName = parts.join(" ")
    }

    const table = (cells[idx.table] ?? "").trim()
    if (!firstName && !lastName) continue
    if (!table) continue

    tableSet.add(table)
    guests.push({
      id: `g-${i}-${Math.random().toString(36).slice(2, 8)}`,
      firstName,
      lastName,
      table,
    })
  }

  if (guests.length === 0) {
    return { guests: [], tables: [], error: "No valid guest rows were found." }
  }

  return { guests, tables: Array.from(tableSet) }
}

function findCol(header: string[], names: string[]): number {
  for (const name of names) {
    const i = header.indexOf(name)
    if (i !== -1) return i
  }
  return -1
}

/** Splits CSV text into rows of cells, handling quoted fields and commas. */
function splitRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i]

    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}
