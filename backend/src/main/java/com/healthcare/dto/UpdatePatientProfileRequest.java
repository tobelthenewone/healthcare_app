package com.healthcare.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdatePatientProfileRequest {

    private LocalDate dateOfBirth;

    @Size(max = 5)
    private String bloodGroup;

    @Size(max = 1000)
    private String allergies;

    @Size(max = 2000)
    private String medicalNotes;

}