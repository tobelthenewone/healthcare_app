package com.healthcare.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ConsultationResponse {

    private Long id;

    private Long appointmentId;

    private Long patientId;

    private String patientName;

    private Long professionalId;

    private String professionalName;

    private Instant appointmentTime;

    private String diagnosis;

    private String prescription;

    private String recommendations;

    private String notes;

    private Instant createdAt;

    private Instant updatedAt;
}