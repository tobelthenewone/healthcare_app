import api from "@/lib/api";
import { Consultation, CreateConsultationRequest } from "@/types/consultation";

const consultationService = {
  async consultationExists(
    appointmentId: number,
  ): Promise<{ exists: boolean }> {
    const response = await api.get<{ exists: boolean }>(
      `/professional/appointments/${appointmentId}/consultation/exists`,
    );

    return response.data;
  },
  async create(
    appointmentId: number,
    data: CreateConsultationRequest,
  ): Promise<Consultation> {
    const response = await api.post<Consultation>(
      `/professional/appointments/${appointmentId}/consultation`,
      data,
    );

    return response.data;
  },

  async update(
    consultationId: number,
    data: CreateConsultationRequest,
  ): Promise<Consultation> {
    const response = await api.put<Consultation>(
      `/professional/consultations/${consultationId}`,
      data,
    );

    return response.data;
  },

  async getByAppointment(appointmentId: number): Promise<Consultation> {
    const response = await api.get<Consultation>(
      `/professional/appointments/${appointmentId}/consultation`,
    );

    return response.data;
  },

  async getPatientHistory(): Promise<Consultation[]> {
    const response = await api.get<Consultation[]>("/patient/consultations");

    return response.data;
  },

  async getPatientConsultation(consultationId: number): Promise<Consultation> {
    const response = await api.get<Consultation>(
      `/patient/consultations/${consultationId}`,
    );

    return response.data;
  },
};

export default consultationService;
