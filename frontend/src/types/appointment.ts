export interface AppointmentResponse {

  id: number;

  patientId: number;
  patientName: string;

  professionalId: number;
  professionalName: string;

  appointmentTime: string;
  reason: string;

  status: string;

  createdAt: string;
}

export interface PagedResponse<T> {

  content: T[];

  pageNumber: number;
  pageSize: number;

  totalElements: number;
  totalPages: number;

  last: boolean;
}

export interface AppointmentFilterRequest {

  status?: string;

  professionalId?: number;

  patientId?: number;

  startDate?: string;
  endDate?: string;

  page?: number;
  size?: number;
}