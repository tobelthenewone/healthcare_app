"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import RoleGuard from "@/components/auth/role-guard";
import StatusBadge from "@/components/appointments/status-badge";
import LoadingState from "@/components/ui/loading-state";
import PageHeader from "@/components/ui/page-header";

import professionalAppointmentService from "@/services/professional-appointment-service";

import { AppointmentResponse } from "@/types/appointment";

export default function ProfessionalPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    try {
      const data = await professionalAppointmentService.getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(appointmentId: number, status: string) {
    try {
      await professionalAppointmentService.updateStatus(appointmentId, status);

      await loadAppointments();
    } catch (error) {
      console.error("Failed to update appointment", error);
      alert("Failed to update appointment");
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await loadAppointments();
    };

    initialize();
  }, []);

  if (loading) {
    return <LoadingState label="Loading appointments..." />;
  }

  return (
    <RoleGuard allowedRoles={["PROFESSIONAL"]}>
      <div>
        <PageHeader
          eyebrow="Appointments"
          title="Professional Dashboard"
          subtitle="Manage appointments, update statuses, and complete consultations."
        />

        {appointments.length === 0 && (
          <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-10 text-center">
            <p className="text-slate-500">No appointments found.</p>
          </div>
        )}

        <div className="space-y-5">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A9 9 0 1118.364 4.56M15 11a3 3 0 11-6 0 3 3 0 016 0zm-3 5c-2.761 0-5 1.343-5 3h10c0-1.657-2.239-3-5-3z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {appointment.patientName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      Patient Appointment
                    </p>
                  </div>
                </div>

                <StatusBadge status={appointment.status} />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Reason
                  </p>

                  <p className="text-slate-800 dark:text-slate-200">
                    {appointment.reason || "No reason provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Appointment Time
                  </p>

                  <p className="text-slate-800 dark:text-slate-200">
                    {new Date(
                      appointment.appointmentTime,
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {appointment.status === "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "CONFIRMED",
                          )
                        }
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold shadow-emerald-500/20 transition-all duration-200"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            appointment.id,
                            "REJECTED",
                          )
                        }
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all duration-200"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {appointment.status === "CONFIRMED" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          appointment.id,
                          "COMPLETED",
                        )
                      }
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold transition-all duration-200"
                    >
                      Complete Appointment
                    </button>
                  )}

                  {appointment.status === "COMPLETED" && (
                    <Link
                      href={`/professional/consultation/${appointment.id}`}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-semibold transition-all duration-200"
                    >
                      Open Consultation
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}