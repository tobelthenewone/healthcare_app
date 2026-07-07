"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import consultationService from "@/services/consultationService";
import { Consultation } from "@/types/consultation";

export default function MedicalHistoryPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await consultationService.getPatientHistory();
        setConsultations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Medical History</h1>

      {consultations.length === 0 && (
        <p className="text-gray-500">No consultation records found.</p>
      )}

      <div className="space-y-4">
        {consultations.map((consultation) => (
          <Link
            key={consultation.id}
            href={`/patient/medical-history/${consultation.id}`}
            className="block border rounded-xl p-5 bg-white hover:shadow transition"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">
                  {consultation.professionalName}
                </h2>

                <p className="text-gray-500 mt-1">{consultation.diagnosis}</p>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(consultation.appointmentTime).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
