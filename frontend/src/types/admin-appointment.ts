export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface AppointmentResponse {
  id: number;

  patientId: number;

  patientName: string;

  professionalId: number;

  professionalName: string;

  appointmentTime: string;

  status: AppointmentStatus;

  reason: string;

  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];

  page: number;

  size: number;

  totalElements: number;

  totalPages: number;
}