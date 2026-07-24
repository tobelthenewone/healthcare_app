package com.healthcare.dto;


import com.healthcare.model.AppointmentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class AppointmentResponse {

    private Long id;

    private Long patientId;
    private String patientName;
    private Long professionalId;
    private String professionalName;

    private Instant appointmentTime;

    private AppointmentStatus status;

    private String reason;

    private Instant createdAt;
}