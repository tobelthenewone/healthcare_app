import api from "@/lib/api";

import {
  AvailableSlotResponse,
  BookAppointmentRequest,
} from "@/types/booking";

const bookingService = {

  async getAvailableSlots(
    professionalId: number,
    date: string,
  ): Promise<AvailableSlotResponse[]> {

    const response =
      await api.get<
        AvailableSlotResponse[]
      >(
        "/patient/appointments/available-slots",
        {
          params: {
            professionalId,
            date,
          },
        }
      );

    return response.data;
  },

  async bookAppointment(
    data: BookAppointmentRequest
  ): Promise<void> {

    await api.post(
      "/patient/appointments",
      data
    );
  },
};

export default bookingService;