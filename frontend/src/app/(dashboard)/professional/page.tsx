"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

import { AppointmentResponse } from "@/types/appointment";

import StatusBadge from "@/components/appointments/status-badge";

import professionalAppointmentService from "@/services/professional-appointment-service";

import RoleGuard from "@/components/auth/role-guard";

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
      console.error("Failed to update status", error);

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
    return <div>Loading appointments...</div>;
  }

  return (
    <RoleGuard allowedRoles={["PROFESSIONAL"]}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Professional Dashboard</h1>

        {appointments.length === 0 && (
          <p className="text-gray-500">No appointments found.</p>
        )}

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {appointment.patientName}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Reason: {appointment.reason}
                  </p>
                </div>

                <StatusBadge status={appointment.status} />
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Appointment Time:{" "}
                  {new Date(appointment.appointmentTime).toLocaleString()}
                </p>
              </div>
              {appointment.status === "COMPLETED" && (
                <div className="mt-5">
                  <Link
                    href={`/professional/consultation/${appointment.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Consultation
                  </Link>
                </div>
              )}
              {appointment.status === "PENDING" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => updateStatus(appointment.id, "CONFIRMED")}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(appointment.id, "REJECTED")}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
