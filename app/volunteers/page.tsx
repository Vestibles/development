"use client";

import { useState } from "react";
import { Plus, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { IconDelete } from "@/components/ui/IconDelete";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useEvent } from "@/lib/context/EventContext";

export default function VolunteersPage() {
  const {
    data,
    addVolunteer,
    updateVolunteer,
    removeVolunteer,
    addShift,
    updateShift,
    removeShift,
  } = useEvent();
  const [shiftVolunteer, setShiftVolunteer] = useState(data.volunteers[0]?.id ?? "");
  const [shiftArea, setShiftArea] = useState("Main stall");
  const [shiftStart, setShiftStart] = useState("10:00");
  const [shiftEnd, setShiftEnd] = useState("13:00");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Volunteers"
        subtitle="Add, edit, or remove team members and shifts"
      />

      <ExportPanel data={data} scope="volunteers" variant="compact" />

      <Button
        fullWidth
        onClick={() =>
          addVolunteer({
            name: "New volunteer",
            email: "",
            phone: "",
            role: "Helper",
          })
        }
      >
        <Plus className="h-5 w-5" /> Add volunteer
      </Button>

      <div className="space-y-3">
        {data.volunteers.map((v) => (
          <Card key={v.id}>
            <div className="mb-2 flex justify-end">
              <IconDelete
                itemName={v.name}
                onDelete={() => removeVolunteer(v.id)}
              />
            </div>
            <Field
              label="Name"
              value={v.name}
              onChange={(e) => updateVolunteer(v.id, { name: e.target.value })}
            />
            <div className="mt-2">
              <Field
                label="Role"
                value={v.role}
                onChange={(e) => updateVolunteer(v.id, { role: e.target.value })}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
              {v.phone ? (
                <a href={`tel:${v.phone}`} className="flex items-center gap-1">
                  <Phone className="h-4 w-4" /> {v.phone}
                </a>
              ) : null}
              {v.email ? (
                <a href={`mailto:${v.email}`} className="flex items-center gap-1">
                  <Mail className="h-4 w-4" /> {v.email}
                </a>
              ) : null}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <Field
                label="Phone"
                type="tel"
                value={v.phone}
                onChange={(e) => updateVolunteer(v.id, { phone: e.target.value })}
              />
              <Field
                label="Email"
                type="email"
                value={v.email}
                onChange={(e) => updateVolunteer(v.id, { email: e.target.value })}
              />
              <Field
                label="Notes"
                value={v.notes ?? ""}
                onChange={(e) =>
                  updateVolunteer(v.id, { notes: e.target.value || null })
                }
              />
            </div>
          </Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Shifts</h2>
        {data.shifts.map((shift) => (
          <Card key={shift.id} padding="sm">
            <div className="mb-2 flex justify-end">
              <IconDelete
                itemName="shift"
                onDelete={() => removeShift(shift.id)}
              />
            </div>
            <SelectField
              label="Volunteer"
              value={shift.volunteer_id}
              onChange={(e) =>
                updateShift(shift.id, { volunteer_id: e.target.value })
              }
            >
              {data.volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </SelectField>
            <div className="mt-2">
              <Field
                label="Stall or area"
                value={shift.stall_or_area}
                onChange={(e) =>
                  updateShift(shift.id, { stall_or_area: e.target.value })
                }
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Field
                label="Start"
                type="time"
                value={shift.shift_start}
                onChange={(e) =>
                  updateShift(shift.id, { shift_start: e.target.value })
                }
              />
              <Field
                label="End"
                type="time"
                value={shift.shift_end}
                onChange={(e) =>
                  updateShift(shift.id, { shift_end: e.target.value })
                }
              />
            </div>
            <div className="mt-2">
              <Field
                label="Notes"
                value={shift.notes ?? ""}
                onChange={(e) =>
                  updateShift(shift.id, { notes: e.target.value || null })
                }
              />
            </div>
          </Card>
        ))}

        <Card>
          <p className="mb-3 text-sm font-medium">Add shift</p>
          <div className="space-y-3">
            <SelectField
              label="Volunteer"
              value={shiftVolunteer}
              onChange={(e) => setShiftVolunteer(e.target.value)}
            >
              {data.volunteers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </SelectField>
            <Field
              label="Stall or area"
              value={shiftArea}
              onChange={(e) => setShiftArea(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Start"
                type="time"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
              />
              <Field
                label="End"
                type="time"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
              />
            </div>
            <Button
              fullWidth
              disabled={!shiftVolunteer}
              onClick={() => {
                if (!shiftVolunteer) return;
                addShift({
                  volunteer_id: shiftVolunteer,
                  stall_or_area: shiftArea,
                  shift_start: shiftStart,
                  shift_end: shiftEnd,
                });
              }}
            >
              Assign shift
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
