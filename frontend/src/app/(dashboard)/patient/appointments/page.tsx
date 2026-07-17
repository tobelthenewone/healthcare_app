"use client";

import { useEffect, useState } from "react";

import appointmentService from "@/services/appointment-service";

import { AppointmentResponse } from "@/types/appointment";

import StatusBadge from "@/components/appointments/status-badge";

import RoleGuard from "@/components/auth/role-guard";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  async function loadAppointments() {
    try {
      const response = await appointmentService.getAppointments({
        page: 0,
        size: 20,
      });

      setAppointments(response);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(appointmentId: number) {
    try {
      setCancellingId(appointmentId);

      await appointmentService.cancelAppointment(appointmentId);

      await loadAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment", error);

      alert("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await loadAppointments();
    };

    initialize();
  }, []);

  return (
    <RoleGuard allowedRoles={["PATIENT"]}>
      <div>
        <PageHeader
          eyebrow="Your Schedule"
          title="My Appointments"
          subtitle="Keep track of upcoming visits and past consultations with your care team."
        />

        {loading ? (
          <LoadingState label="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="Once you book a visit with a professional, it will show up here."
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
              >
                <div className="flex items-start justify-between gap-4">
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
                          d="M4.871 4A17.926 17.926 0 003 12c0 2.871.67 5.585 1.871 8m14.13 0a17.93 17.93 0 001.87-8c0-2.871-.67-5.585-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.513.692l-1.17 1.4a2 2 0 01-3.07 0l-1.17-1.4A2 2 0 006.58 8H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        {appointment.professionalName}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Patient: {appointment.patientName}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={appointment.status} />
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid sm:grid-cols-2 gap-3 text-sm">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(appointment.appointmentTime).toLocaleString()}
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
                    Reason: {appointment.reason}
                  </div>
                </div>

                {appointment.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    disabled={cancellingId === appointment.id}
                    className="mt-5 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-4 py-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {cancellingId === appointment.id
                      ? "Cancelling..."
                      : "Cancel Appointment"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
