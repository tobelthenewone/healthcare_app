package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PatientDashboardResponse {

    private long upcomingAppointments;

    private long completedAppointments;

    private long consultationRecords;
}