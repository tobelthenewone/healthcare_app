import api from "@/lib/api";

import {
  ProfessionalResponse,
} from "@/types/professional";

const professionalService = {

  async getProfessionals():
    Promise<ProfessionalResponse[]> {

    const response =
      await api.get<
        ProfessionalResponse[]
      >("/patient/professionals");

    return response.data;
  },
};

export default professionalService;