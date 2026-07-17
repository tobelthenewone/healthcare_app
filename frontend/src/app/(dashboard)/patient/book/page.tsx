"use client";

import { useEffect, useState } from "react";

import bookingService from "@/services/booking-service";

import { AvailableSlotResponse } from "@/types/booking";

import professionalService from "@/services/professional-service";

import { ProfessionalResponse } from "@/types/professional";

import RoleGuard from "@/components/auth/role-guard";
import PageHeader from "@/components/ui/page-header";

export default function BookAppointmentPage() {
  const [professionals, setProfessionals] = useState<ProfessionalResponse[]>(
    [],
  );

  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfessionalResponse | null>(null);
  const [expandedProfessionalId, setExpandedProfessionalId] = useState<
    number | null
  >(null);
  const [date, setDate] = useState("");

  const [reason, setReason] = useState("");

  const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false);

  async function loadProfessionals() {
    try {
      const data = await professionalService.getProfessionals();

      setProfessionals(data);
    } catch (error) {
      console.error("Failed to load professionals", error);
    }
  }
  useEffect(() => {
    const fetchProfessionals = async () => {
      await loadProfessionals(); // inside this, setState happens after fetch
    };
    fetchProfessionals();
  }, []);

  async function loadSlots() {
    if (!date || !selectedProfessional) {
      return;
    }

    try {
      setLoading(true);

      const isoDate = new Date(date).toISOString();

      const data = await bookingService.getAvailableSlots(
        selectedProfessional?.id ?? 0,
        isoDate,
      );

      setSlots(data);
    } catch (error) {
      console.error("Failed to load slots", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking() {
    if (!selectedSlot) {
      return;
    }

    try {
      setBookingLoading(true);

      await bookingService.bookAppointment({
        professionalId: selectedProfessional?.id ?? 0,

        appointmentTime: selectedSlot,

        reason,
      });

      alert("Appointment booked successfully");

      setSelectedSlot(null);

      await loadSlots();
    } catch (error) {
      console.error("Booking failed", error);

      alert("Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <RoleGuard allowedRoles={["PATIENT"]}>
      <div className="max-w-3xl">
        <PageHeader
          eyebrow="New Appointment"
          title="Book Appointment"
          subtitle="Choose a professional, pick a date, and grab an available slot."
        />

        <div className="space-y-8">
          {/* Step 1 - Professional */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <label className="font-semibold text-slate-900 dark:text-white">
                Select Professional
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professionals.map((professional) => {
                const isSelected = selectedProfessional?.id === professional.id;

                return (
                  <div
                    key={professional.id}
                    className={`
                      relative rounded-2xl p-5 border transition-all duration-200
                      ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-500/10 shadow-sm"
                          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-sm"
                      }
                    `}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                        Selected
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedProfessional(professional)}
                      className="w-full text-left cursor-pointer"
                    >
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white pr-16">
                        {professional.fullName}
                      </h2>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        {professional.email}
                      </p>

                      <p className="text-sm mt-2 text-slate-600 dark:text-slate-300">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Specialties:
                        </span>{" "}
                        {professional.specialties || "Not provided"}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedProfessionalId(
                          expandedProfessionalId === professional.id
                            ? null
                            : professional.id,
                        )
                      }
                      className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition cursor-pointer"
                    >
                      {expandedProfessionalId === professional.id
                        ? "Hide Description"
                        : "View Description"}
                    </button>

                    {expandedProfessionalId === professional.id && (
                      <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                          About
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {professional.description ||
                            "This professional hasn't added a description yet."}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2 - Date */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <label className="font-semibold text-slate-900 dark:text-white">
                Select Date
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full sm:max-w-xs px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
              />

              <button
                onClick={loadSlots}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 text-sm cursor-pointer"
              >
                Load Available Slots
              </button>
            </div>
          </div>

          {loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading slots...
            </p>
          )}

          {/* Step 3 - Slots */}
          {!loading && slots.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Available Slots
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.startTime;

                  return (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelectedSlot(slot.startTime)}
                      className={`
                        rounded-2xl p-3.5 text-left border transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-600 to-teal-500 border-transparent text-white shadow-md shadow-emerald-500/20"
                            : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-300 dark:hover:border-emerald-500/40"
                        }
                      `}
                    >
                      <p className="font-medium text-sm">
                        {new Date(slot.startTime).toLocaleTimeString()}
                      </p>

                      <p
                        className={`text-xs mt-0.5 ${
                          isSelected
                            ? "text-white/80"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        to {new Date(slot.endTime).toLocaleTimeString()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 - Confirm */}
          {selectedSlot && (
            <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm resize-none"
                  rows={4}
                  placeholder="Briefly describe the reason for your visit..."
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {bookingLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
