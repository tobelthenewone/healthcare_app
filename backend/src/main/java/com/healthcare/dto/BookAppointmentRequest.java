package com.healthcare.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class BookAppointmentRequest {

    @NotNull(message = "Professional ID is required")
    private Long professionalId;

    @NotNull(message = "Appointment time is required")
    @Future(message = "Appointment time must be in the future")
    private Instant appointmentTime;

    @NotBlank(message = "Reason is required")
    private String reason;
}