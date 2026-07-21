"use client";

import { useEffect, useMemo, useState } from "react";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import adminService from "@/services/admin-service";

import { AppointmentResponse } from "@/types/admin-appointment";
import StatusBadge from "@/components/appointments/status-badge";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

export default function AdminCalendarPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await adminService.filterAppointments({});

      setAppointments(response.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      await Promise.resolve();

      await load();
    }

    initialize();
  }, []);

  const appointmentCountByDate = useMemo(() => {
    const counts = new Map<string, number>();

    appointments.forEach((appointment) => {
      const key = new Date(appointment.appointmentTime).toDateString();

      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return counts;
  }, [appointments]);

  const appointmentsOnSelectedDate = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          new Date(appointment.appointmentTime).toDateString() ===
          selectedDate.toDateString(),
      )
      .sort(
        (a, b) =>
          new Date(a.appointmentTime).getTime() -
          new Date(b.appointmentTime).getTime(),
      );
  }, [appointments, selectedDate]);

  const formattedSelectedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <PageHeader
        eyebrow="Scheduling"
        title="Appointment Calendar"
        subtitle="Pick a date to see everything scheduled across the clinic."
      />

      {loading ? (
        <LoadingState label="Loading appointments..." />
      ) : (
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-5">
            <Calendar
              value={selectedDate}
              onChange={(value) => setSelectedDate(value as Date)}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;

                const count = appointmentCountByDate.get(date.toDateString());

                if (!count) return null;

                return (
                  <div className="flex justify-center mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                );
              }}
            />
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {formattedSelectedDate}
              </h2>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1 rounded-full">
                {appointmentsOnSelectedDate.length}{" "}
                {appointmentsOnSelectedDate.length === 1
                  ? "appointment"
                  : "appointments"}
              </span>
            </div>

            {appointmentsOnSelectedDate.length === 0 ? (
              <EmptyState
                title="Nothing scheduled"
                description="There are no appointments booked for this date."
              />
            ) : (
              <div className="space-y-4">
                {appointmentsOnSelectedDate.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
                          <svg
                            className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400"
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
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            with {appointment.professionalName}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={appointment.status} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <svg
                          className="w-4 h-4 text-slate-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(appointment.appointmentTime).toLocaleTimeString(
                          undefined,
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <svg
                          className="w-4 h-4 text-slate-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 10h8m-8 4h4m-9 5h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
                          />
                        </svg>
                        {appointment.reason}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
          background: transparent;
          line-height: 1.4;
        }
        .react-calendar__navigation button {
          font-weight: 600;
          font-size: 0.9rem;
          color: rgb(15 23 42);
          border-radius: 0.75rem;
        }
        .react-calendar__navigation button {
          color: #ffffff !important;
          background: transparent !important;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgb(236 253 245);
        }
        .dark .react-calendar__navigation button:enabled:hover,
        .dark .react-calendar__navigation button:enabled:focus {
          background-color: rgba(16, 185, 129, 0.1);
        }
        .react-calendar__month-view__weekdays {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgb(100 116 139);
        }
        .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }
        .react-calendar__tile {
          border-radius: 0.75rem;
          padding: 0.6em 0.4em;
          color: rgb(30 41 59);
          font-size: 0.85rem;
          position: relative;
        }
        .dark .react-calendar__tile {
          color: rgb(226 232 240);
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgb(236 253 245);
        }
        .dark .react-calendar__tile:enabled:hover,
        .dark .react-calendar__tile:enabled:focus {
          background-color: rgba(16, 185, 129, 0.1);
        }
        .react-calendar__tile--now {
          background: rgb(236 253 245);
          font-weight: 600;
        }
        .dark .react-calendar__tile--now {
          background: rgba(16, 185, 129, 0.12);
        }
        .react-calendar__tile--active,
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: linear-gradient(to right, #059669, #14b8a6);
          color: white;
          font-weight: 600;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: rgb(203 213 225);
        }
      `}</style>
    </div>
  );
}
