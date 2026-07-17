"use client";

import { useEffect, useState } from "react";

import scheduleService from "@/services/schedule-service";

import { ProfessionalSchedule } from "@/types/schedule";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";

const dayLabels: Record<ProfessionalSchedule["dayOfWeek"], string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const hourFields: {
  key: "startHour" | "endHour" | "breakStartHour" | "breakEndHour";
  label: string;
}[] = [
    { key: "startHour", label: "Start Hour" },
    { key: "endHour", label: "End Hour" },
    { key: "breakStartHour", label: "Break Start" },
    { key: "breakEndHour", label: "Break End" },
  ];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ProfessionalSchedule[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<string | null>(null);
  const [savedDay, setSavedDay] = useState<string | null>(null);

  async function saveSchedule(schedule: ProfessionalSchedule) {
    try {
      setSavingDay(schedule.dayOfWeek);

      await scheduleService.updateSchedule(schedule);

      setSavedDay(schedule.dayOfWeek);
      setTimeout(() => setSavedDay(null), 2000);
    } catch (error) {
      console.error(error);

      alert("Failed to save schedule");
    } finally {
      setSavingDay(null);
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
    return <LoadingState label="Loading schedules..." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Availability"
        title="My Schedule"
        subtitle="Set your working hours and break times for each day of the week."
      />

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.dayOfWeek}
            className={`
              bg-white dark:bg-slate-900/40 rounded-3xl border shadow-sm p-6 transition-all duration-300
              ${schedule.enabled
                ? "border-slate-100 dark:border-slate-800"
                : "border-slate-100 dark:border-slate-800 opacity-70"
              }
            `}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {dayLabels[schedule.dayOfWeek]}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {schedule.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <span className="relative inline-flex items-center">
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
                      className="sr-only peer"
                    />
                    <span className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-emerald-500 transition-colors duration-200" />
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
                  </span>
                </label>

                <button
                  onClick={() => saveSchedule(schedule)}
                  disabled={savingDay === schedule.dayOfWeek}
                  className={`
                    text-sm font-semibold px-5 py-2 rounded-xl shadow-md active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 cursor-pointer
                    ${savedDay === schedule.dayOfWeek
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                      : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20"
                    }
                  `}
                >
                  {savingDay === schedule.dayOfWeek ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : savedDay === schedule.dayOfWeek ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hourFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    disabled={!schedule.enabled}
                    value={schedule[key] ?? ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      setSchedules((prev) =>
                        prev.map((s) =>
                          s.dayOfWeek === schedule.dayOfWeek
                            ? {
                              ...s,
                              [key]: value,
                            }
                            : s,
                        ),
                      );
                    }}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
