import api from "@/lib/api";

import { UserProfileResponse } from "@/types/admin";
import {
  AppointmentResponse,
  PagedResponse,
  AppointmentStatus,
} from "@/types/admin-appointment";
import { AppointmentFilterRequest } from "@/types/admin-filter";
const adminService = {
  async getUsers(): Promise<UserProfileResponse[]> {
    const response = await api.get<UserProfileResponse[]>("/admin/users");

    return response.data;
  },
  async updateUserStatus(
    id: number,
    enabled: boolean,
  ): Promise<UserProfileResponse> {
    const response = await api.put<UserProfileResponse>(
      `/admin/users/${id}/status`,
      null,
      {
        params: {
          enabled,
        },
      },
    );

    return response.data;
  },
  async getUserById(id: number): Promise<UserProfileResponse> {
    const response = await api.get<UserProfileResponse>(`/admin/users/${id}`);

    return response.data;
  },
  async getAppointments(
    status: AppointmentStatus,
    page = 0,
    size = 10,
  ): Promise<PagedResponse<AppointmentResponse>> {
    const response = await api.get("/admin/appointments", {
      params: {
        status,
        page,
        size,
      },
    });

    return response.data;
  },
  async filterAppointments(
    filters: AppointmentFilterRequest,
    page = 0,
    size = 10,
  ): Promise<PagedResponse<AppointmentResponse>> {
    const response = await api.get("/admin/appointments/filter", {
      params: {
        ...filters,
        page,
        size,
      },
    });

    return response.data;
  },
};

export default adminService;
