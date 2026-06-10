import type { SeatingData } from "./seating-types"

/**
 * ============================================================================
 *  WEDDING SEATING DATA — edit everything here. This is the only file to change.
 * ============================================================================
 *
 *  HOW TO ADD / EDIT GUESTS
 *  ------------------------
 *  Each guest is one line inside the `guests: [ ... ]` list below.
 *  Copy an existing line and change the values. The `table` value must match
 *  one of the table `label`s defined in the `tables` list further down
 *  (for example "1", "2", or "Head Table").
 *
 *    { firstName: "Olivia", lastName: "Bennett", table: "1" },
 *
 *  - firstName / lastName: how the guest searches for themselves.
 *  - table: which table they are seated at (must match a table label).
 *  - The `id` is generated automatically, so you don't need to add one.
 *
 *  HOW TO ADD / EDIT / MOVE TABLES
 *  -------------------------------
 *  Each table is one line inside the `tables: [ ... ]` list.
 *
 *    { label: "1", shape: "round", x: 20, y: 26, seats: 8 },
 *
 *  - label: the table number/name shown on the plan and matched to guests.
 *  - shape: "round" or "rect".
 *  - x / y: position on the floor plan as a percentage (0 = left/top,
 *           100 = right/bottom). Tweak these to match your real venue.
 *  - seats: how many seats at the table (shown in the result card).
 *
 *  HOW TO MOVE THE STAGE / DANCE FLOOR / BAR / ENTRANCE
 *  ---------------------------------------------------
 *  Edit the `fixtures` list. x/y is the center, width/height is the size,
 *  all as percentages of the floor plan.
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
  { firstName: "Lucas", lastName: "Romano", table: "Head Table" },
  { firstName: "Charlotte", lastName: "Romano", table: "Head Table" },
]

export const SEATING_DATA: SeatingData = {
  eventTitle: "Julia & Christian",

  fixtures: [
    { id: "f-stage", type: "stage", label: "Head Table", x: 50, y: 9, width: 34, height: 11 },
    { id: "f-dance", type: "dancefloor", label: "Dance Floor", x: 50, y: 50, width: 30, height: 22 },
    { id: "f-entrance", type: "entrance", label: "Entrance", x: 50, y: 95, width: 22, height: 7 },
    { id: "f-bar", type: "bar", label: "Bar", x: 90, y: 50, width: 13, height: 30 },
  ],

  tables: [
    { id: "t1", label: "1", shape: "round", x: 20, y: 26, seats: 8 },
    { id: "t2", label: "2", shape: "round", x: 38, y: 26, seats: 8 },
    { id: "t3", label: "3", shape: "round", x: 62, y: 26, seats: 8 },
    { id: "t4", label: "4", shape: "round", x: 20, y: 50, seats: 8 },
    { id: "t5", label: "5", shape: "round", x: 38, y: 50, seats: 8 },
    { id: "t6", label: "6", shape: "round", x: 62, y: 72, seats: 8 },
    { id: "t7", label: "7", shape: "round", x: 38, y: 72, seats: 8 },
    { id: "t8", label: "8", shape: "round", x: 20, y: 72, seats: 8 },
  ],

  // Generated from the GUESTS list above — no need to edit this.
  guests: GUESTS.map((g, i) => ({ id: `g${i + 1}`, ...g })),
}
