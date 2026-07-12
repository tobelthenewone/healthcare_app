package com.healthcare.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfessionalProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String specialties;

    private String description;

}