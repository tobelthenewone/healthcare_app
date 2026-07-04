"use client";

import { useParams } from "next/navigation";

export default function ConsultationPage() {
  const { appointmentId } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Consultation</h1>

      <p>Appointment ID: {appointmentId}</p>
    </div>
  );
}
