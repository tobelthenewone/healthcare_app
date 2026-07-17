"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";

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
        title={
          consultation
            ? "Edit Consultation"
            : "New Consultation"
        }
        subtitle="Complete the patient's consultation record."
      />

      <div className="space-y-6">

        {fields.map((field) => (

          <div
            key={field.key}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
          >

            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-600 mb-3">

              {field.label}

            </label>

            <textarea
              rows={field.rows}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [field.key]:
                    e.target.value,
                })
              }
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-slate-900
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500/20
                focus:border-emerald-500
                transition-all
                resize-none
              "
            />

          </div>

        ))}

        <div className="flex justify-end">

          <button
            onClick={save}
            disabled={saving}
            className="
              px-7
              py-3
              rounded-xl
              font-semibold
              text-white
              shadow-lg
              transition-all
              active:scale-[0.98]
              disabled:opacity-50
              disabled:cursor-not-allowed
              bg-gradient-to-r
              from-emerald-600
              to-teal-500
              hover:from-emerald-500
              hover:to-teal-400
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