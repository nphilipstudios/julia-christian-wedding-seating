"use client"

import { useRef, useState } from "react"
import { Upload, Trash2, Download, Move, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { parseGuestsCsv } from "@/lib/parse-csv"
import { autoLayoutTables } from "@/lib/use-seating-store"
import type { SeatingData } from "@/lib/seating-types"
import { FloorPlan } from "./floor-plan"

interface ManagePanelProps {
  data: SeatingData
  onChange: (next: SeatingData) => void
  onReset: () => void
}

export function ManagePanel({ data, onChange, onReset }: ManagePanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result ?? "")
      const { guests, tables, error } = parseGuestsCsv(text)
      if (error) {
        toast.error(error)
        return
      }
      // Keep positions for tables that already exist, auto-layout the new ones.
      const existingByLabel = new Map(data.tables.map((t) => [t.label.toLowerCase(), t]))
      const newOnes = tables.filter((label) => !existingByLabel.has(label.toLowerCase()))
      const laidOut = autoLayoutTables(newOnes)
      const mergedTables = [
        ...data.tables.filter((t) => tables.some((l) => l.toLowerCase() === t.label.toLowerCase())),
        ...laidOut,
      ]
      onChange({ ...data, guests, tables: mergedTables })
      toast.success(`Imported ${guests.length} guests across ${tables.length} tables.`)
    }
    reader.readAsText(file)
  }

  function moveTable(clientX: number, clientY: number) {
    if (!draggingId || !dragRef.current) return
    const rect = dragRef.current.getBoundingClientRect()
    const x = Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.min(96, Math.max(4, ((clientY - rect.top) / rect.height) * 100))
    onChange({
      ...data,
      tables: data.tables.map((t) =>
        t.id === draggingId ? { ...t, x: Math.round(x), y: Math.round(y) } : t,
      ),
    })
  }

  const selectedTable = data.tables.find((t) => t.id === selectedTableId) ?? null

  return (
    <div className="space-y-8">
      {/* Upload */}
      <section>
        <h3 className="flex items-center gap-2 font-serif text-xl text-foreground">
          <Upload className="size-5 text-primary" /> Guest list
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a CSV with columns for guest name and table number. Existing table positions are
          kept.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ""
          }}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" /> Upload CSV
          </Button>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="size-4" /> Download template
          </Button>
          <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
            <Trash2 className="size-4" /> Reset to sample
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {data.guests.length} guests loaded. Data is saved only in this browser.
        </p>
      </section>

      <Separator />

      {/* Event title */}
      <section className="max-w-sm">
        <Label htmlFor="event-title">Event title</Label>
        <Input
          id="event-title"
          value={data.eventTitle}
          onChange={(e) => onChange({ ...data, eventTitle: e.target.value })}
          className="mt-1.5"
        />
      </section>

      <Separator />

      {/* Floor plan editor */}
      <section>
        <h3 className="flex items-center gap-2 font-serif text-xl text-foreground">
          <Move className="size-5 text-primary" /> Arrange tables
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag any table to reposition it on the floor plan. Click a table to edit its details.
        </p>

        <div
          ref={dragRef}
          className="mt-4 touch-none"
          onPointerMove={(e) => {
            if (draggingId) moveTable(e.clientX, e.clientY)
          }}
          onPointerUp={() => setDraggingId(null)}
          onPointerLeave={() => setDraggingId(null)}
        >
          <div
            onPointerDown={(e) => {
              const target = (e.target as HTMLElement).closest("button[aria-label^='Table']")
              if (!target) return
            }}
          >
            <FloorPlanDraggable
              data={data}
              selectedTableId={selectedTableId}
              onTablePointerDown={(id) => {
                setSelectedTableId(id)
                setDraggingId(id)
              }}
            />
          </div>
        </div>

        {selectedTable && (
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4">
            <div>
              <Label htmlFor="table-label" className="text-xs">
                Table label
              </Label>
              <Input
                id="table-label"
                value={selectedTable.label}
                onChange={(e) =>
                  onChange({
                    ...data,
                    tables: data.tables.map((t) =>
                      t.id === selectedTable.id ? { ...t, label: e.target.value } : t,
                    ),
                  })
                }
                className="mt-1 h-9 w-32"
              />
            </div>
            <div>
              <Label htmlFor="table-shape" className="text-xs">
                Shape
              </Label>
              <select
                id="table-shape"
                value={selectedTable.shape}
                onChange={(e) =>
                  onChange({
                    ...data,
                    tables: data.tables.map((t) =>
                      t.id === selectedTable.id
                        ? { ...t, shape: e.target.value as "round" | "rect" }
                        : t,
                    ),
                  })
                }
                className="mt-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="round">Round</option>
                <option value="rect">Rectangular</option>
              </select>
            </div>
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                onChange({
                  ...data,
                  tables: data.tables.filter((t) => t.id !== selectedTable.id),
                })
                setSelectedTableId(null)
              }}
            >
              <Trash2 className="size-4" /> Remove table
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}

/** Floor plan variant where tables start dragging on pointer down. */
function FloorPlanDraggable({
  data,
  selectedTableId,
  onTablePointerDown,
}: {
  data: SeatingData
  selectedTableId: string | null
  onTablePointerDown: (id: string) => void
}) {
  return (
    <div className="relative">
      <FloorPlan data={data} selectedTableId={selectedTableId} onTableClick={() => {}} />
      {/* transparent overlay buttons to capture pointerdown for dragging */}
      <div className="pointer-events-none absolute inset-0">
        {data.tables.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Drag table ${t.label}`}
            onPointerDown={() => onTablePointerDown(t.id)}
            className="pointer-events-auto absolute cursor-grab rounded-full active:cursor-grabbing"
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: "11%",
              height: "11%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  )
}

function downloadTemplate() {
  const csv =
    "First Name,Last Name,Table\nOlivia,Bennett,1\nLiam,Bennett,1\nSophia,Carter,2\nNoah,Reyes,3\n"
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "guest-list-template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export const ManageIcon = Settings
