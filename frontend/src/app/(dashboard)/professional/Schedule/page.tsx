"use client";

import { useEffect, useState } from "react";

import scheduleService from "@/services/schedule-service";

import { ProfessionalSchedule } from "@/types/schedule";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ProfessionalSchedule[]>([]);

  const [loading, setLoading] = useState(true);

  async function saveSchedule(schedule: ProfessionalSchedule) {
    try {
      await scheduleService.updateSchedule(schedule);

      alert(`${schedule.dayOfWeek} updated`);
    } catch (error) {
      console.error(error);

      alert("Failed to save schedule");
    }
  }
  async function loadSchedules() {
    try {
      const data = await scheduleService.getMySchedule();

      setSchedules(data);
    } catch (error) {
      console.error("Failed to load schedules", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      await loadSchedules();
    }

    initialize();
  }, []);

  if (loading) {
    return <div>Loading schedules...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Schedule</h1>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.dayOfWeek}
            className="
                border
                rounded-lg
                p-4
                bg-white
              "
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">{schedule.dayOfWeek}</h2>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={schedule.enabled}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.dayOfWeek === schedule.dayOfWeek
                          ? {
                              ...s,
                              enabled: checked,
                            }
                          : s,
                      ),
                    );
                  }}
                />
                Enabled
              </label>
            </div>
            <button
              onClick={() => saveSchedule(schedule)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <div className="mt-4 grid gap-3">
              <label>
                Start Hour
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={schedule.startHour ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.dayOfWeek === schedule.dayOfWeek
                          ? {
                              ...s,
                              startHour: value,
                            }
                          : s,
                      ),
                    );
                  }}
                  className="w-full border rounded px-2 py-1"
                />
              </label>

              <label>
                End Hour
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={schedule.endHour ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.dayOfWeek === schedule.dayOfWeek
                          ? {
                              ...s,
                              endHour: value,
                            }
                          : s,
                      ),
                    );
                  }}
                  className="w-full border rounded px-2 py-1"
                />
              </label>

              <label>
                Break Start
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={schedule.breakStartHour ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.dayOfWeek === schedule.dayOfWeek
                          ? {
                              ...s,
                              breakStartHour: value,
                            }
                          : s,
                      ),
                    );
                  }}
                  className="w-full border rounded px-2 py-1"
                />
              </label>

              <label>
                Break End
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={schedule.breakEndHour ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setSchedules((prev) =>
                      prev.map((s) =>
                        s.dayOfWeek === schedule.dayOfWeek
                          ? {
                              ...s,
                              breakEndHour: value,
                            }
                          : s,
                      ),
                    );
                  }}
                  className=" w-full border rounded px-2 py-1 "
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
