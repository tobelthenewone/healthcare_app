package com.healthcare.dto;

import com.healthcare.model.UserRole;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private UserRole role;
    private Long id;
    
    public AuthResponse(String token, String email, String fullName, UserRole role, Long id) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.id = id;
    }
}