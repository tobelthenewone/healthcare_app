import api from "@/lib/api";

import {
  AppointmentFilterRequest,
  AppointmentResponse,
} from "@/types/appointment";

const appointmentService = {

  async getAppointments(
    filters: AppointmentFilterRequest,
  ): Promise<AppointmentResponse[]> {

    const response =
      await api.get<
        AppointmentResponse[]
      >(
        "/patient/appointments",
        {
          params: filters,
        },
      );

    return response.data;
  },

  async cancelAppointment(
    appointmentId: number
  ): Promise<void> {

    await api.put(
      `/patient/appointments/${appointmentId}/cancel`
    );
  },
};

export default appointmentService;