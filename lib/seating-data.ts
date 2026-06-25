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
  { label: "1", x: 25.6, y: 56.5 },
  { label: "3", x: 30.3, y: 60.1 },
  { label: "5", x: 35.5, y: 65.3 },
  { label: "7", x: 41.6, y: 69.7 },
  { label: "9", x: 46.8, y: 73.7 },
  { label: "11", x: 52.5, y: 79.2 },
  { label: "13", x: 49.7, y: 87.3 },
  { label: "15", x: 44.8, y: 83.0 },
  { label: "17", x: 40.0, y: 79.2 },
  { label: "19", x: 34.9, y: 73.5 },
  { label: "21", x: 29.8, y: 69.7 },
  { label: "23", x: 24.9, y: 65.3 },
  { label: "25", x: 19.9, y: 61.2 },
  { label: "27", x: 16.3, y: 66.9 },
  { label: "29", x: 21.2, y: 70.5 },
  { label: "31", x: 26.3, y: 75.5 },
  { label: "33", x: 31.4, y: 80.0 },
  { label: "35", x: 35.3, y: 85.0 },
  { label: "37", x: 41.1, y: 89.5 },
  { label: "39", x: 47.1, y: 94.1 },
  { label: "41", x: 19.6, y: 81.4 },
  { label: "43", x: 14.8, y: 76.5 },
  // Top / right cluster (even numbers)
  { label: "2", x: 43.3, y: 28.2 },
  { label: "4", x: 49.5, y: 33.3 },
  { label: "6", x: 55.2, y: 37.0 },
  { label: "8", x: 59.9, y: 41.5 },
  { label: "10", x: 65.4, y: 46.5 },
  { label: "12", x: 69.9, y: 50.6 },
  { label: "14", x: 78.7, y: 48.7 },
  { label: "16", x: 74.0, y: 44.2 },
  { label: "18", x: 69.0, y: 38.5 },
  { label: "20", x: 63.2, y: 33.7 },
  { label: "22", x: 58.4, y: 30.3 },
  { label: "24", x: 52.7, y: 26.5 },
  { label: "26", x: 47.5, y: 22.0 },
  { label: "28", x: 51.8, y: 15.4 },
  { label: "30", x: 57.5, y: 21.4 },
  { label: "32", x: 63.7, y: 24.8 },
  { label: "34", x: 69.0, y: 28.8 },
  { label: "36", x: 74.0, y: 33.3 },
  { label: "38", x: 78.7, y: 38.8 },
  { label: "40", x: 83.0, y: 42.2 },
  { label: "42", x: 85.8, y: 35.4 },
  { label: "44", x: 80.9, y: 31.0 },
  { label: "46", x: 76.3, y: 26.1 },
  { label: "48", x: 71.2, y: 22.2 },
  { label: "50", x: 66.3, y: 18.0 },
  { label: "52", x: 60.8, y: 13.3 },
  { label: "54", x: 55.7, y: 8.8 },
  { label: "56", x: 60.2, y: 3.4 },
  { label: "58", x: 65.1, y: 7.1 },
  { label: "60", x: 69.7, y: 11.2 },
  { label: "62", x: 75.5, y: 16.1 },
  { label: "64", x: 79.6, y: 20.0 },
  { label: "66", x: 84.1, y: 24.9 },
]

export const SEATING_DATA: SeatingData = {
  eventTitle: "Julia & Christian",

  fixtures: [
    { id: "f-dance", type: "dancefloor", label: "Dance Floor", x: 49.5, y: 52, width: 24, height: 31, rotation: 15 },
    { id: "f-backdrop", type: "backdrop", label: "Backdrop", x: 31, y: 36, width: 18, height: 7, rotation: -57 },
    { id: "f-dj", type: "dj", label: "DJ", x: 26, y: 47, width: 5.5, height: 5 },
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
