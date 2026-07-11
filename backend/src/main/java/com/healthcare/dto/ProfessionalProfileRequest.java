package com.healthcare.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfessionalProfileRequest {

    @Size(max = 100)
    private String specialty;

    @Size(max = 2000)
    private String description;

}