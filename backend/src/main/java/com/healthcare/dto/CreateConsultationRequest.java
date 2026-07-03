package com.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateConsultationRequest {

    @NotBlank
    private String diagnosis;

    private String prescription;

    private String recommendations;

    private String notes;
}