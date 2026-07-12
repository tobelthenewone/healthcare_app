package com.healthcare.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfessionalProfileUpdateRequest {

    @Size(max = 200)
    private String specialties;

    @Size(max = 2000)
    private String description;

}