package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;

    private long totalPatients;

    private long totalProfessionals;

    private long totalAppointments;
}