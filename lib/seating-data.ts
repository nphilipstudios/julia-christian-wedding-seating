import type { SeatingData } from "./seating-types"

/**
 * ============================================================================
 *  WEDDING SEATING DATA — edit everything here. This is the only file to change.
 * ============================================================================
 *
 *  HOW TO ADD / EDIT GUESTS
 *  ------------------------
 *  Each guest is one line inside the `GUESTS` list below.
 *  Copy an existing line and change the values. The `table` value must match
 *  one of the table labels (odd 1-39 on the lower-left, even 2-72 on the
 *  top-right).
 *
 *    { firstName: "Olivia", lastName: "Bennett", table: "1" },
 *
 *  HOW TABLE POSITIONS WORK
 *  ------------------------
 *  The tables are arranged as two evenly-spaced diagonal grids (lattices) so
 *  every table is the same size and the same distance apart, matching the
 *  venue layout. Each lattice is defined by:
 *    origin = position (in % of the background image) of the first table
 *    u      = step vector to the next table along a row (down-right)
 *    v      = step vector to the next row
 *  Tune those vectors below to nudge a whole cluster at once.
 * ============================================================================
 */

type RawGuest = { firstName: string; lastName: string; table: string }

const GUESTS: RawGuest[] = [
  { firstName: "Olivia", lastName: "Bennett", table: "1" },
  { firstName: "Liam", lastName: "Bennett", table: "1" },
  { firstName: "Sophia", lastName: "Carter", table: "2" },
  { firstName: "Noah", lastName: "Reyes", table: "3" },
  { firstName: "Ava", lastName: "Morgan", table: "4" },
  { firstName: "Ethan", lastName: "Walsh", table: "5" },
  { firstName: "Isabella", lastName: "Nguyen", table: "6" },
  { firstName: "Mason", lastName: "Foster", table: "7" },
  { firstName: "Mia", lastName: "Patel", table: "8" },
  { firstName: "Lucas", lastName: "Romano", table: "39" },
  { firstName: "Charlotte", lastName: "Romano", table: "72" },
]

type Vec = { x: number; y: number }

/**
 * Build evenly-spaced table positions for one diagonal cluster.
 * `rows` lists the table labels for each row, in down-right order.
 * position(label) = origin + columnIndex * u + rowIndex * v
 */
function buildLattice(
  rows: string[][],
  origin: Vec,
  u: Vec,
  v: Vec,
): { label: string; x: number; y: number }[] {
  const out: { label: string; x: number; y: number }[] = []
  rows.forEach((row, k) => {
    row.forEach((label, i) => {
      out.push({
        label,
        x: origin.x + i * u.x + k * v.x,
        y: origin.y + i * u.y + k * v.y,
      })
    })
  })
  return out
}

// --- Even cluster (top / right of the dance floor) ---------------------------
// 5 diagonal rows. Numbering snakes back and forth, so some rows are listed
// right-to-left to keep them in down-right order.
const EVEN_ROWS = [
  ["2", "4", "6", "8", "10", "12"],
  ["26", "24", "22", "20", "18", "16", "14"],
  ["28", "30", "32", "34", "36", "38", "40", "42"],
  ["56", "54", "52", "50", "48", "46", "44"],
  ["58", "60", "62", "64", "66", "68", "70", "72"],
]
const EVEN = buildLattice(
  EVEN_ROWS,
  { x: 46, y: 29.5 }, // table 2
  { x: 3.9, y: 3.75 }, // step along a row
  { x: 4.0, y: -5.6 }, // step to the next row (up-right)
)

// --- Odd cluster (lower-left) -------------------------------------------------
// 4 diagonal rows, same snake pattern.
const ODD_ROWS = [
  ["1", "3", "5", "7", "9"],
  ["19", "17", "15", "13", "11"],
  ["21", "23", "25", "27", "29", "31"],
  ["39", "37", "35", "33"],
]
const ODD = buildLattice(
  ODD_ROWS,
  { x: 29, y: 54 }, // table 1
  { x: 4.5, y: 4.2 }, // step along a row
  { x: -4.2, y: 4.8 }, // step to the next row (down-left)
)

const TABLE_POSITIONS = [...ODD, ...EVEN]

export const SEATING_DATA: SeatingData = {
  eventTitle: "Julia & Christian",

  // The venue layout (walls, dance floor, backdrop, DJ booth) is the background
  // image at public/venue-floor-plan.png, so there are no drawn fixtures.
  fixtures: [],

  tables: TABLE_POSITIONS.map((t) => ({
    id: `t${t.label}`,
    label: t.label,
    shape: "round" as const,
    x: t.x,
    y: t.y,
    seats: 10,
  })),

  // Generated from the GUESTS list above — no need to edit this.
  guests: GUESTS.map((g, i) => ({ id: `g${i + 1}`, ...g })),
}
