package com.healthcare.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PatientProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String allergies;

    private String medicalNotes;

}