export interface AvailableSlotResponse {

  startTime: string;

  endTime: string;
}

export interface BookAppointmentRequest {

  professionalId: number;

  appointmentTime: string;

  reason: string;
}