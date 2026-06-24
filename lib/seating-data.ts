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
 *  one of the table `label`s defined in the `tables` list further down
 *  (for example "1", "2", ... "66").
 *
 *    { firstName: "Olivia", lastName: "Bennett", table: "1" },
 *
 *  - firstName / lastName: how the guest searches for themselves.
 *  - table: which table they are seated at (must match a table label).
 *  - The `id` is generated automatically, so you don't need to add one.
 *
 *  HOW TO MOVE TABLES OR FIXTURES
 *  ------------------------------
 *  Each table / fixture has x / y given as a percentage (0 = left/top,
 *  100 = right/bottom) of the floor plan. Tweak these to nudge anything.
 *  Fixtures also have width/height (percent) and an optional rotation (deg).
 *  The positions below were traced from the venue floor plan you provided.
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
  { firstName: "Charlotte", lastName: "Romano", table: "66" },
]

// Table positions (x, y as % of the floor plan), traced from the venue plan.
const TABLE_POSITIONS: { label: string; x: number; y: number }[] = [
  // Lower-left cluster (odd numbers)
  { label: "1", x: 29.2, y: 55.6 },
  { label: "3", x: 33.8, y: 58.9 },
  { label: "5", x: 38.4, y: 62.9 },
  { label: "7", x: 43.7, y: 66.4 },
  { label: "9", x: 49.0, y: 69.9 },
  { label: "11", x: 53.8, y: 74.1 },
  { label: "13", x: 52.1, y: 81.0 },
  { label: "15", x: 46.7, y: 77.6 },
  { label: "17", x: 42.3, y: 74.4 },
  { label: "19", x: 38.1, y: 69.9 },
  { label: "21", x: 33.2, y: 66.4 },
  { label: "23", x: 28.7, y: 62.9 },
  { label: "25", x: 24.1, y: 59.1 },
  { label: "27", x: 21.0, y: 64.4 },
  { label: "29", x: 25.4, y: 67.6 },
  { label: "31", x: 29.7, y: 71.4 },
  { label: "33", x: 34.5, y: 75.3 },
  { label: "35", x: 38.4, y: 79.3 },
  { label: "37", x: 43.4, y: 82.8 },
  { label: "39", x: 49.0, y: 87.0 },
  { label: "41", x: 26.4, y: 75.9 },
  { label: "43", x: 21.3, y: 72.2 },
  // Top / right cluster (even numbers)
  { label: "2", x: 46.2, y: 32.1 },
  { label: "4", x: 50.8, y: 36.7 },
  { label: "6", x: 55.8, y: 39.5 },
  { label: "8", x: 60.6, y: 43.4 },
  { label: "10", x: 65.0, y: 47.4 },
  { label: "12", x: 69.3, y: 50.9 },
  { label: "14", x: 78.0, y: 48.4 },
  { label: "16", x: 72.8, y: 45.3 },
  { label: "18", x: 68.7, y: 41.0 },
  { label: "20", x: 63.7, y: 37.1 },
  { label: "22", x: 59.1, y: 34.2 },
  { label: "24", x: 54.8, y: 30.4 },
  { label: "26", x: 49.7, y: 27.3 },
  { label: "28", x: 54.6, y: 22.6 },
  { label: "30", x: 59.1, y: 26.6 },
  { label: "32", x: 63.7, y: 29.9 },
  { label: "34", x: 68.2, y: 32.9 },
  { label: "36", x: 73.3, y: 36.4 },
  { label: "38", x: 77.4, y: 41.0 },
  { label: "40", x: 81.7, y: 44.1 },
  { label: "42", x: 84.1, y: 38.3 },
  { label: "44", x: 79.7, y: 34.8 },
  { label: "46", x: 75.3, y: 30.8 },
  { label: "48", x: 70.6, y: 27.3 },
  { label: "50", x: 66.2, y: 24.0 },
  { label: "52", x: 61.1, y: 20.1 },
  { label: "54", x: 56.5, y: 16.2 },
  { label: "56", x: 61.6, y: 12.9 },
  { label: "58", x: 66.7, y: 17.3 },
  { label: "60", x: 72.1, y: 20.8 },
  { label: "62", x: 77.4, y: 24.7 },
  { label: "64", x: 82.7, y: 28.3 },
  { label: "66", x: 86.8, y: 32.1 },
]

export const SEATING_DATA: SeatingData = {
  eventTitle: "Julia & Christian",

  fixtures: [
    { id: "f-dance", type: "dancefloor", label: "Dance Floor", x: 49.5, y: 48.5, width: 27, height: 21, rotation: 13 },
    { id: "f-backdrop", type: "backdrop", label: "Backdrop", x: 37.8, y: 37.7, width: 19, height: 5.5, rotation: -68 },
    { id: "f-dj", type: "dj", label: "DJ", x: 29.4, y: 48.8, width: 5.5, height: 5 },
  ],

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
