package com.healthcare.dto;

import com.healthcare.model.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private UserRole role;  // PATIENT or PROFESSIONAL
}