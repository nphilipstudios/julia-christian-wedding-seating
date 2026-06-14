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
  type: "stage" | "dancefloor" | "entrance" | "bar" | "backdrop" | "dj" | "photobooth"
  label: string
  x: number
  y: number
  width: number
  height: number
  /** optional rotation in degrees, used to angle fixtures like the dance floor */
  rotation?: number
}

export interface SeatingData {
  guests: Guest[]
  tables: VenueTable[]
  fixtures: VenueFixture[]
  eventTitle: string
}
