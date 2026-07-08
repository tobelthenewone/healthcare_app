"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import consultationService from "@/services/consultationService";
import { Consultation } from "@/types/consultation";

export default function ConsultationDetailsPage() {
  const params = useParams();

  const consultationId = Number(params.consultationId);

  const [consultation, setConsultation] = useState<Consultation | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data =
          await consultationService.getPatientConsultation(consultationId);

        setConsultation(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [consultationId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!consultation) {
    return <div>Consultation not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Consultation Record</h1>

      <div className="space-y-6">
        <section>
          <h2 className="font-semibold mb-2">Professional</h2>
          <p>{consultation.professionalName}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Diagnosis</h2>
          <p>{consultation.diagnosis}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Prescription</h2>
          <p>{consultation.prescription}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Recommendations</h2>
          <p>{consultation.recommendations}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Notes</h2>
          <p>{consultation.notes}</p>
        </section>
      </div>
    </div>
  );
}
