import api from "@/lib/api";

export interface PatientProfileResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  bloodGroup: string | null;
  allergies: string | null;
  medicalNotes: string | null;
}

export interface UpdatePatientProfileRequest {
  dateOfBirth: string | null;
  bloodGroup: string | null;
  allergies: string;
  medicalNotes: string;
}

export const patientProfileService = {
  async getProfile(): Promise<PatientProfileResponse> {
    const response = await api.get<PatientProfileResponse>("/patient/profile");

    return response.data;
  },

  async updateProfile(
    request: UpdatePatientProfileRequest,
  ): Promise<PatientProfileResponse> {
    const response = await api.put<PatientProfileResponse>(
      "/patient/profile",
      request,
    );

    return response.data;
  },
};
