"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import consultationService from "@/services/consultationService";
import { Consultation } from "@/types/consultation";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

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

  return (
    <div>
      <PageHeader
        eyebrow="Health Records"
        title="Medical History"
        subtitle="Review diagnoses, prescriptions, and notes from your past consultations."
      />

      {loading ? (
        <LoadingState label="Loading your records..." />
      ) : consultations.length === 0 ? (
        <EmptyState
          title="No consultation records found"
          description="Records from completed appointments will appear here."
        />
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Link
              key={consultation.id}
              href={`/patient/medical-history/${consultation.id}`}
              className="group flex items-center justify-between gap-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-300"
            >
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {consultation.professionalName}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {consultation.diagnosis}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  {new Date(consultation.appointmentTime).toLocaleDateString()}
                </span>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
