import api from "@/lib/api";

import { ProfessionalSchedule } from "@/types/schedule";

const scheduleService = {
  async getMySchedule(): Promise<ProfessionalSchedule[]> {
    const response = await api.get<ProfessionalSchedule[]>(
      "/professional/schedule",
    );

    return response.data;
  },
  async updateSchedule(
    schedule: ProfessionalSchedule,
  ): Promise<ProfessionalSchedule> {
    const response = await api.put<ProfessionalSchedule>(
      "/professional/schedule",
      schedule,
    );

    return response.data;
  },
};

export default scheduleService;
