import api from "@/lib/api";

import { AppointmentResponse } from "@/types/appointment";

const professionalAppointmentService = {
  async getAppointments(): Promise<AppointmentResponse[]> {
    const response = await api.get<AppointmentResponse[]>(
      "/professional/appointments",
    );

    return response.data;
  },

  async updateStatus(appointmentId: number, status: string): Promise<void> {
    await api.put(`/professional/appointments/${appointmentId}/status`, {
      status,
    });
  },
};

export default professionalAppointmentService;
