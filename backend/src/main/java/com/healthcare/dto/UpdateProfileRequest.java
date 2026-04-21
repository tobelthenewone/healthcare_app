package com.healthcare.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone is required")
    private String phone;
}