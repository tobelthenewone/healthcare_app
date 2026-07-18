"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import {
  BeakerIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import consultationService from "@/services/consultationService";

import {
  Consultation,
  CreateConsultationRequest,
} from "@/types/consultation";

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = Number(params.appointmentId);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [consultation, setConsultation] =
    useState<Consultation | null>(null);

  const [form, setForm] =
    useState<CreateConsultationRequest>({
      diagnosis: "",
      prescription: "",
      recommendations: "",
      notes: "",
    });

  useEffect(() => {
    async function initialize() {
      try {
        const result =
          await consultationService.consultationExists(
            appointmentId,
          );

        if (!result.exists) {
          setLoading(false);
          return;
        }

        const data =
          await consultationService.getByAppointment(
            appointmentId,
          );

        setConsultation(data);

        setForm({
          diagnosis: data.diagnosis,
          prescription: data.prescription,
          recommendations: data.recommendations,
          notes: data.notes,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [appointmentId]);

  async function save() {
    try {
      setSaving(true);

      if (consultation) {
        await consultationService.update(
          consultation.id,
          form,
        );
      } else {
        await consultationService.create(
          appointmentId,
          form,
        );
      }

      router.push("/professional/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Failed to save consultation.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <LoadingState label="Loading consultation..." />
    );
  }

  const fields = [
    {
      label: "Diagnosis",
      key: "diagnosis",
      rows: 4,
      placeholder:
        "Enter diagnosis...",
    },
    {
      label: "Prescription",
      key: "prescription",
      rows: 4,
      placeholder:
        "Medications, dosage and duration...",
    },
    {
      label: "Recommendations",
      key: "recommendations",
      rows: 4,
      placeholder:
        "Lifestyle changes, follow-up advice...",
    },
    {
      label: "Clinical Notes",
      key: "notes",
      rows: 6,
      placeholder:
        "Additional consultation notes...",
    },

  ] as const;

  return (
    <div>

      <PageHeader
        eyebrow="Medical Record"
        title={consultation ? "Edit Consultation" : "New Consultation"}
        subtitle="Complete the patient's consultation record."
      />

      <div className="space-y-6">
        {fields.map((field) => {
          const iconStyles = {
            diagnosis: {
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
              border: "border-emerald-100 dark:border-emerald-500/20",
              text: "text-emerald-600 dark:text-emerald-400",
              icon: BeakerIcon,
              subtitle: "Primary diagnosis and assessment",
            },
            prescription: {
              bg: "bg-blue-50 dark:bg-blue-500/10",
              border: "border-blue-100 dark:border-blue-500/20",
              text: "text-blue-600 dark:text-blue-400",
              icon: ClipboardDocumentListIcon,
              subtitle: "Medication, dosage and duration",
            },
            recommendations: {
              bg: "bg-amber-50 dark:bg-amber-500/10",
              border: "border-amber-100 dark:border-amber-500/20",
              text: "text-amber-600 dark:text-amber-400",
              icon: HeartIcon,
              subtitle: "Follow-up and lifestyle advice",
            },
            notes: {
              bg: "bg-violet-50 dark:bg-violet-500/10",
              border: "border-violet-100 dark:border-violet-500/20",
              text: "text-violet-600 dark:text-violet-400",
              icon: DocumentTextIcon,
              subtitle: "Additional clinical observations",
            },
          }[field.key];
          const Icon = iconStyles.icon;

          return (
            <div
              key={field.key}
              className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300"
            >
              <div className="flex items-center gap-4 p-6">
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconStyles.bg} ${iconStyles.border}`}
                >
                  <Icon className={`w-6 h-6 ${iconStyles.text}`} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {field.label}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {iconStyles.subtitle}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 p-6">
                <textarea
                  rows={field.rows}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]: e.target.value,
                    })
                  }
                  className="
              w-full
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-700
              bg-slate-50
              dark:bg-slate-900
              px-4
              py-3
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500/20
              focus:border-emerald-500
              transition-all
              resize-none
            "
                />
              </div>
            </div>
          );
        })}

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="
        text-sm
        font-semibold
        px-6
        py-3
        rounded-xl
        shadow-md
        active:scale-[0.98]
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        bg-gradient-to-r
        from-emerald-600
        to-teal-500
        hover:from-emerald-500
        hover:to-teal-400
        text-white
        shadow-emerald-500/20
      "
          >
            {saving
              ? "Saving..."
              : consultation
                ? "Update Consultation"
                : "Save Consultation"}
          </button>
        </div>
      </div>

    </div>
  );
}