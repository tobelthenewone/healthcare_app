"use client";

import { useEffect, useState } from "react";

import bookingService from "@/services/booking-service";

import { AvailableSlotResponse } from "@/types/booking";

import professionalService from "@/services/professional-service";

import { ProfessionalResponse } from "@/types/professional";

export default function BookAppointmentPage() {
  const [professionals, setProfessionals] = useState<ProfessionalResponse[]>(
    [],
  );

  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfessionalResponse | null>(null);

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
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-black">Book Appointment</h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-4 font-medium text-black">
            Select Professional
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionals.map((professional) => {
              const isSelected = selectedProfessional?.id === professional.id;

              return (
                <button
                  key={professional.id}
                  type="button"
                  onClick={() => setSelectedProfessional(professional)}
                  className={`
                border rounded-xl p-4 text-left transition
                ${isSelected ? "bg-black text-white" : "bg-white hover:border-black text-black"}
              `}
                >
                  <h2 className="font-semibold text-lg text-black">
                    {professional.fullName}
                  </h2>

                  <p className="text-sm opacity-70 mt-1 text-black">
                    {professional.email}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-black">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md px-4 py-2 w-full text-black"
          />
        </div>

        <button
          onClick={loadSlots}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Load Available Slots
        </button>

        {loading && <p className="text-black">Loading slots...</p>}

        {!loading && slots.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Available Slots
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot.startTime;

                return (
                  <button
                    key={slot.startTime}
                    onClick={() => setSelectedSlot(slot.startTime)}
                    className={`
                  border rounded-lg p-3 text-left transition
                  ${isSelected ? "bg-black text-white" : "bg-white text-black"}
                `}
                  >
                    <p className="font-medium text-black">
                      {new Date(slot.startTime).toLocaleTimeString()}
                    </p>

                    <p className="text-sm opacity-70 text-black">
                      to {new Date(slot.endTime).toLocaleTimeString()}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedSlot && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-black">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border rounded-md px-4 py-2 w-full text-black"
                rows={4}
              />
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
