export interface CreateConsultationRequest {
  diagnosis: string;
  prescription: string;
  recommendations: string;
  notes: string;
}

export interface Consultation {
  id: number;
  appointmentId: number;

  patientId: number;
  patientName: string;

  professionalId: number;
  professionalName: string;

  appointmentTime: string;

  diagnosis: string;
  prescription: string;
  recommendations: string;
  notes: string;

  createdAt: string;
  updatedAt: string;
}
