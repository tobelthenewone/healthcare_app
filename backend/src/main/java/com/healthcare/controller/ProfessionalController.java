package com.healthcare.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthcare.security.CustomUserDetails;

@RestController
@RequestMapping("/api/professional")
public class ProfessionalController {

    @PreAuthorize("hasRole('PROFESSIONAL')")
    @GetMapping("/dashboard")
    public String professionalDashboard() {
        return "Professional dashboard";
    }
        // Secure endpoint (REAL data access)
    @PreAuthorize("hasRole('PROFESSIONAL')")
    @GetMapping("/me")
    public String getMyData(@AuthenticationPrincipal CustomUserDetails user) {
        return "Fetching data for user ID: " + user.getId();
    }
}