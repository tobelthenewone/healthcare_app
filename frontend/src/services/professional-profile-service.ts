import api from "@/lib/api";

export interface ProfessionalProfileResponse {
  id: number;
  fullName: string;
  email: string;
  specialties: string;
  description: string;
}

export interface UpdateProfessionalProfileRequest {
  specialties: string;
  description: string;
}

export const professionalProfileService = {
  async getProfile(): Promise<ProfessionalProfileResponse> {
    const response = await api.get<ProfessionalProfileResponse>(
      "/professional/profile",
    );

    return response.data;
  },

  async updateProfile(
    request: UpdateProfessionalProfileRequest,
  ): Promise<ProfessionalProfileResponse> {
    const response = await api.put<ProfessionalProfileResponse>(
      "/professional/profile",
      request,
    );

    return response.data;
  },
};
