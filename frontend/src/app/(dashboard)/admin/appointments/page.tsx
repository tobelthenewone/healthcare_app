"use client";

import { useEffect, useState } from "react";

import adminService from "@/services/admin-service";
import { AppointmentStatus } from "@/types/admin-appointment";
import { AppointmentResponse } from "@/types/admin-appointment";
import { useCallback } from "react";
export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<AppointmentStatus>("PENDING");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await adminService.filterAppointments(
        { status },
        page,
        10,
      );

      setAppointments(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    async function initialize() {
      await Promise.resolve();

      await load();
    }

    initialize();
  }, [load]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as AppointmentStatus);
          setPage(0);
        }}
        className="text-black border rounded px-3 py-2 mb-6"
      >
        <option value="PENDING">PENDING</option>

        <option value="CONFIRMED">CONFIRMED</option>

        <option value="REJECTED">REJECTED</option>

        <option value="COMPLETED">COMPLETED</option>

        <option value="CANCELLED">CANCELLED</option>
      </select>
      <div className="text-black flex gap-4 mb-6 ">



      </div>
      <div
        className="text-black
          space-y-4
        "
      >
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="text-black border rounded-lg p-4 "
          >
            <div>
              <strong>Patient:</strong> {appointment.patientName}
            </div>

            <div>
              <strong>Professional:</strong> {appointment.professionalName}
            </div>

            <div>
              <strong>Time:</strong>{" "}
              {new Date(appointment.appointmentTime).toLocaleString()}
            </div>

            <div>
              <strong>Reason:</strong> {appointment.reason}
            </div>

            <div>
              <strong>Status:</strong> {appointment.status}
            </div>
          </div>
        ))}
      </div>
      <div
        className="text-black
    flex
    gap-3
    mt-6
  "
      >
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          className="text=black
    border
    px-4
    py-2
    rounded
  "
        >
          Previous
        </button>

        <span>
          Page {page + 1}
          {" / "}
          {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="text=black
    border
    px-4
    py-2
    rounded
  "
        >
          Next
        </button>
      </div>
    </div>
  );
}
