"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import consultationService from "@/services/consultationService";
import { Consultation } from "@/types/consultation";
import LoadingState from "@/components/ui/loading-state";
import EmptyState from "@/components/ui/empty-state";

const sections: {
  key: keyof Pick<
    Consultation,
    "diagnosis" | "prescription" | "recommendations" | "notes"
  >;
  label: string;
}[] = [
  { key: "diagnosis", label: "Diagnosis" },
  { key: "prescription", label: "Prescription" },
  { key: "recommendations", label: "Recommendations" },
  { key: "notes", label: "Notes" },
];

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
    return <LoadingState label="Loading consultation..." />;
  }

  if (!consultation) {
    return (
      <EmptyState
        title="Consultation not found"
        description="This record may have been removed or the link is incorrect."
      />
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/patient/medical-history"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Medical History
      </Link>

      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8">
        <div className="flex items-start gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
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
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Consultation Record
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {consultation.professionalName} &middot;{" "}
              {new Date(consultation.appointmentTime).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map(({ key, label }) => (
            <section key={key}>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {label}
              </h2>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {consultation[key] || "Not provided."}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
