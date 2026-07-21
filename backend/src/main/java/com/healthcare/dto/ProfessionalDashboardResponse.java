package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfessionalDashboardResponse {

    private long todayAppointments;

    private long pendingAppointments;

    private long completedAppointments;
}