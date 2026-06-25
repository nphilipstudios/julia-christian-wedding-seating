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

// Table positions as % of the venue image (public/venue-floor-plan.png,
// 1456 x 1138). Each value is the center of that table on the real plan,
// so the highlight lands exactly on top of the printed table circle.
const TABLE_POSITIONS: { label: string; x: number; y: number }[] = [
  // Lower-left cluster (odd numbers)
  { label: "1", x: 21.8, y: 43.5 },
  { label: "3", x: 24.9, y: 45.9 },
  { label: "5", x: 28.2, y: 49.2 },
  { label: "7", x: 32.1, y: 52.1 },
  { label: "9", x: 35.4, y: 54.7 },
  { label: "11", x: 39.1, y: 58.2 },
  { label: "13", x: 37.1, y: 63.4 },
  { label: "15", x: 34.3, y: 60.6 },
  { label: "17", x: 31.1, y: 58.2 },
  { label: "19", x: 27.8, y: 54.7 },
  { label: "21", x: 24.5, y: 52.1 },
  { label: "23", x: 21.4, y: 49.2 },
  { label: "25", x: 18.2, y: 46.6 },
  { label: "27", x: 15.9, y: 50.4 },
  { label: "29", x: 19.0, y: 52.7 },
  { label: "31", x: 22.3, y: 55.8 },
  { label: "33", x: 25.5, y: 58.7 },
  { label: "35", x: 28.0, y: 61.9 },
  { label: "37", x: 31.7, y: 64.9 },
  { label: "39", x: 35.6, y: 67.8 },
  { label: "41", x: 18.1, y: 59.6 },
  { label: "43", x: 14.9, y: 56.4 },
  // Top / right cluster (even numbers)
  { label: "2", x: 33.2, y: 25.2 },
  { label: "4", x: 37.1, y: 28.6 },
  { label: "6", x: 40.7, y: 30.9 },
  { label: "8", x: 43.8, y: 33.8 },
  { label: "10", x: 47.0, y: 37.2 },
  { label: "12", x: 50.0, y: 39.7 },
  { label: "14", x: 55.8, y: 38.5 },
  { label: "16", x: 52.7, y: 35.6 },
  { label: "18", x: 49.5, y: 31.9 },
  { label: "20", x: 45.8, y: 28.7 },
  { label: "22", x: 42.8, y: 26.5 },
  { label: "24", x: 39.1, y: 24.2 },
  { label: "26", x: 35.9, y: 21.3 },
  { label: "28", x: 38.7, y: 17.0 },
  { label: "30", x: 42.2, y: 20.8 },
  { label: "32", x: 46.2, y: 23.0 },
  { label: "34", x: 49.5, y: 25.7 },
  { label: "36", x: 52.7, y: 28.4 },
  { label: "38", x: 55.8, y: 32.1 },
  { label: "40", x: 58.5, y: 34.3 },
  { label: "42", x: 60.4, y: 29.9 },
  { label: "44", x: 57.1, y: 27.1 },
  { label: "46", x: 54.3, y: 23.9 },
  { label: "48", x: 51.2, y: 21.4 },
  { label: "50", x: 47.9, y: 18.6 },
  { label: "52", x: 44.3, y: 15.6 },
  { label: "54", x: 40.9, y: 12.7 },
  { label: "56", x: 43.8, y: 9.2 },
  { label: "58", x: 47.0, y: 11.6 },
  { label: "60", x: 50.0, y: 14.2 },
  { label: "62", x: 53.7, y: 17.4 },
  { label: "64", x: 56.3, y: 19.9 },
  { label: "66", x: 59.2, y: 23.1 },
]

export const SEATING_DATA: SeatingData = {
  eventTitle: "Julia & Christian",

  // The venue layout (walls, dance floor, backdrop, DJ booth) is the background
  // image at public/venue-floor-plan.png, so there are no drawn fixtures.
  fixtures: [],

  // X_OFFSET nudges every table horizontally (negative = left, positive = right).
  // Adjust this single value to move the whole set of markers at once.
  tables: TABLE_POSITIONS.map((t) => ({
    id: `t${t.label}`,
    label: t.label,
    shape: "round" as const,
    x: t.x - 1.5,
    y: t.y,
    seats: 10,
  })),

  // Generated from the GUESTS list above — no need to edit this.
  guests: GUESTS.map((g, i) => ({ id: `g${i + 1}`, ...g })),
}
