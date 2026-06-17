"use client";

import { useEffect, useState } from "react";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import adminService from "@/services/admin-service";

import { AppointmentResponse } from "@/types/admin-appointment";

export default function AdminCalendarPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  async function load() {
    try {
      const response = await adminService.filterAppointments({});

      setAppointments(response.content);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function initialize() {
      await Promise.resolve();

      await load();
    }

    initialize();
  }, []);

  const appointmentsToday = appointments.filter((appointment) => {
    const date = new Date(appointment.appointmentTime);

    return date.toDateString() === selectedDate.toDateString();
  });

  return (
    <div>
      <h1
        className="
        text-black
          text-3xl
          font-bold
          mb-6
        "
      >
        Appointment Calendar
      </h1>

      <Calendar
        value={selectedDate}
        onChange={(value) => {
          setSelectedDate(value as Date);
        }}
      />

      <div
        className="text-black
          mt-6
          space-y-4
        "
      >
        {appointmentsToday.map((appointment) => (
          <div
            key={appointment.id}
            className="text-black
                  border
                  rounded
                  p-4
                "
          >
            <div>Patient Name: {appointment.patientName}</div>

            <div>Professional Name: {appointment.professionalName}</div>

            <div>Reason: {appointment.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
