"use client";

import { useEffect, useState } from "react";

import appointmentService from "@/services/appointment-service";

import { AppointmentResponse } from "@/types/appointment";

import StatusBadge from "@/components/appointments/status-badge";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const [loading, setLoading] = useState(true);

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
      await appointmentService.cancelAppointment(appointmentId);

      await loadAppointments();
    } catch (error) {
      console.error("Failed to cancel appointment", error);

      alert("Failed to cancel appointment");
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

  if (appointments.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4">Appointments</h1>

        <p className="text-gray-500">No appointments found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-xl border shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {appointment.professionalName}
                </h2>

                <p className="text-gray-500 mt-1">
                  Patient: {appointment.patientName}
                </p>
              </div>

              <StatusBadge status={appointment.status} />
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>
                Appointment Time:{" "}
                {new Date(appointment.appointmentTime).toLocaleString()}
              </p>

              <p>Reason: {appointment.reason}</p>
            </div>

            {appointment.status !== "CANCELLED" && (
              <button
                onClick={() => handleCancel(appointment.id)}
                className="mt-5 bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
