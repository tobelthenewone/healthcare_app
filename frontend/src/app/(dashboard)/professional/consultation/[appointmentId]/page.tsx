"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import consultationService from "@/services/consultationService";
import { Consultation, CreateConsultationRequest } from "@/types/consultation";

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = Number(params.appointmentId);

  const [loading, setLoading] = useState(true);

  const [consultation, setConsultation] = useState<Consultation | null>(null);

  const [form, setForm] = useState<CreateConsultationRequest>({
    diagnosis: "",
    prescription: "",
    recommendations: "",
    notes: "",
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const result =
          await consultationService.consultationExists(appointmentId);

        if (!result.exists) {
          setLoading(false);
          return;
        }

        const data = await consultationService.getByAppointment(appointmentId);

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
    };

    initialize();
  }, [appointmentId]);

  async function save() {
    try {
      if (consultation) {
        await consultationService.update(consultation.id, form);
      } else {
        await consultationService.create(appointmentId, form);
      }

      alert("Consultation saved.");

      router.push("/professional");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Failed to save consultation.");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-3xl font-bold mb-6">
        {consultation ? "Edit Consultation" : "New Consultation"}
      </h1>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 font-medium">Diagnosis</label>

          <textarea
            className="w-full border rounded-lg p-3"
            rows={4}
            value={form.diagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                diagnosis: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Prescription</label>

          <textarea
            className="w-full border rounded-lg p-3"
            rows={4}
            value={form.prescription}
            onChange={(e) =>
              setForm({
                ...form,
                prescription: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Recommendations</label>

          <textarea
            className="w-full border rounded-lg p-3"
            rows={4}
            value={form.recommendations}
            onChange={(e) =>
              setForm({
                ...form,
                recommendations: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Notes</label>

          <textarea
            className="w-full border rounded-lg p-3"
            rows={6}
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
          />
        </div>

        <button
          onClick={save}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {consultation ? "Update Consultation" : "Save Consultation"}
        </button>
      </div>
    </div>
  );
}
