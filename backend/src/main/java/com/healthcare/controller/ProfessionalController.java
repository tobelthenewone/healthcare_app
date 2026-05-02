package com.healthcare.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthcare.security.CustomUserDetails;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.model.User;
import com.healthcare.service.AppointmentService;

@RestController
@RequestMapping("/api/professional")
public class ProfessionalController {

    private final AppointmentService appointmentService;

    public ProfessionalController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getProfessionalAppointments(
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User professional = userDetails.getUser();

        List<AppointmentResponse> appointments = appointmentService.getProfessionalAppointments(professional);

        return ResponseEntity.ok(appointments);
    }

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