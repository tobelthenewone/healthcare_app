package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfessionalResponse {

    private Long id;

    private String fullName;

    private String email;
}