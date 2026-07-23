import api from "@/lib/api";

import {
  PatientDashboard,
  ProfessionalDashboard,
  AdminDashboard,
} from "@/types/dashboard";

export const dashboardService = {
  async getPatientDashboard(): Promise<PatientDashboard> {
    const response = await api.get<PatientDashboard>("/patient/dashboard");

    return response.data;
  },

  async getProfessionalDashboard(): Promise<ProfessionalDashboard> {
    const response = await api.get<ProfessionalDashboard>(
      "/professional/dashboard",
    );

    return response.data;
  },

  async getAdminDashboard(): Promise<AdminDashboard> {
    const response = await api.get<AdminDashboard>("/admin/dashboard");

    return response.data;
  },
};
