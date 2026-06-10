export type TableShape = "round" | "rect"

export interface VenueTable {
  id: string
  /** Number/label shown on the table, e.g. "1" or "Head Table" */
  label: string
  shape: TableShape
  /** position as a percentage (0-100) of the floor plan container */
  x: number
  y: number
  seats: number
}

export interface Guest {
  id: string
  firstName: string
  lastName: string
  /** the label of the table this guest is assigned to */
  table: string
}

export interface VenueFixture {
  id: string
  type: "stage" | "dancefloor" | "entrance" | "bar"
  label: string
  x: number
  y: number
  width: number
  height: number
}

export interface SeatingData {
  guests: Guest[]
  tables: VenueTable[]
  fixtures: VenueFixture[]
  eventTitle: string
}

export const SAMPLE_DATA: SeatingData = {
  eventTitle: "Emma & James",
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
  guests: [
    { id: "g1", firstName: "Olivia", lastName: "Bennett", table: "1" },
    { id: "g2", firstName: "Liam", lastName: "Bennett", table: "1" },
    { id: "g3", firstName: "Sophia", lastName: "Carter", table: "2" },
    { id: "g4", firstName: "Noah", lastName: "Reyes", table: "3" },
    { id: "g5", firstName: "Ava", lastName: "Morgan", table: "4" },
    { id: "g6", firstName: "Ethan", lastName: "Walsh", table: "5" },
    { id: "g7", firstName: "Isabella", lastName: "Nguyen", table: "6" },
    { id: "g8", firstName: "Mason", lastName: "Foster", table: "7" },
    { id: "g9", firstName: "Mia", lastName: "Patel", table: "8" },
    { id: "g10", firstName: "Lucas", lastName: "Romano", table: "Head Table" },
    { id: "g11", firstName: "Charlotte", lastName: "Romano", table: "Head Table" },
  ],
}
