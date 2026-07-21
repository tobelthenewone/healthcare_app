"use client";

import { useCallback, useEffect, useState } from "react";

import adminService from "@/services/admin-service";
import { AppointmentStatus, AppointmentResponse } from "@/types/admin-appointment";

import StatusBadge from "@/components/appointments/status-badge";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

const statuses: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [status, setStatus] = useState<AppointmentStatus>("PENDING");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const response = await adminService.filterAppointments(
        { status },
        page,
        10,
      );

      setAppointments(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    async function initialize() {
      await load();
    }

    initialize();
  }, [load]);

  return (
    <div>
      <PageHeader
        eyebrow="Scheduling"
        title="Appointments"
        subtitle="Browse and filter every appointment booked across the clinic."
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((option) => (
          <button
            key={option}
            onClick={() => {
              setStatus(option);
              setPage(0);
            }}
            className={`
              px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all duration-200 cursor-pointer
              ${status === option
                ? "bg-gradient-to-r from-emerald-600 to-teal-500 border-transparent text-white shadow-md shadow-emerald-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-200 dark:hover:border-emerald-500/30"
              }
            `}
          >
            {option.charAt(0) + option.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading appointments..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description={`There are no ${status.toLowerCase()} appointments right now.`}
        />
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {totalElements} {totalElements === 1 ? "result" : "results"}
          </p>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
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
                          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 10-8 0"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        {appointment.patientName}
                        <span className="text-slate-400 dark:text-slate-500 font-normal mx-2">
                          &rarr;
                        </span>
                        {appointment.professionalName}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={appointment.status} />
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(appointment.appointmentTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 dark:disabled:hover:border-slate-800 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 dark:disabled:hover:border-slate-800 cursor-pointer"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
