import api from "@/lib/api";
import { Consultation, CreateConsultationRequest } from "@/types/consultation";

class ConsultationService {
  async create(
    appointmentId: number,
    data: CreateConsultationRequest,
  ): Promise<Consultation> {
    const response = await api.post(
      `/professional/appointments/${appointmentId}/consultation`,
      data,
    );

    return response.data;
  }

  async update(
    consultationId: number,
    data: CreateConsultationRequest,
  ): Promise<Consultation> {
    const response = await api.put(
      `/professional/consultations/${consultationId}`,
      data,
    );

    return response.data;
  }

  async getByAppointment(appointmentId: number): Promise<Consultation> {
    const response = await api.get(
      `/professional/appointments/${appointmentId}/consultation`,
    );

    return response.data;
  }

  async getPatientHistory(): Promise<Consultation[]> {
    const response = await api.get("/patient/consultations");

    return response.data;
  }

  async getPatientConsultation(consultationId: number): Promise<Consultation> {
    const response = await api.get(`/patient/consultations/${consultationId}`);

    return response.data;
  }
}

export default ConsultationService;
