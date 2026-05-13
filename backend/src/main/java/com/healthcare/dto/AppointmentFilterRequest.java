package com.healthcare.dto;

import com.healthcare.model.AppointmentStatus;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class AppointmentFilterRequest {

    private AppointmentStatus status;

    private Long patientId;

    private Long professionalId;

    private Instant from;

    private Instant to;
}