export interface PatientDashboard {
  upcomingAppointments: number;
  completedAppointments: number;
  consultationRecords: number;
}

export interface ProfessionalDashboard {
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

export interface AdminDashboard {
  totalUsers: number;
  totalPatients: number;
  totalProfessionals: number;
  totalAppointments: number;
}
