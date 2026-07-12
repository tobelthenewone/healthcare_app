package com.healthcare.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthcare.dto.UpdateAppointmentStatusRequest;

import jakarta.validation.Valid;
import com.healthcare.dto.UpdateProfessionalScheduleRequest;
import com.healthcare.security.CustomUserDetails;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.ProfessionalProfileUpdateRequest;
import com.healthcare.dto.ProfessionalProfileResponse;
import com.healthcare.dto.ProfessionalScheduleResponse;
import com.healthcare.model.User;
import com.healthcare.service.AppointmentService;
import com.healthcare.service.ProfessionalScheduleService;
import com.healthcare.service.UserService;

@RestController
@RequestMapping("/api/professional")
public class ProfessionalController {

    private final UserService userService;
    private final AppointmentService appointmentService;
    private final ProfessionalScheduleService professionalScheduleService;

    public ProfessionalController(
            UserService userService,
            AppointmentService appointmentService,
            ProfessionalScheduleService professionalScheduleService) {
        this.userService = userService;
        this.appointmentService = appointmentService;
        this.professionalScheduleService = professionalScheduleService;
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<ProfessionalScheduleResponse>> getMySchedule(
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User professional = userDetails.getUser();

        List<ProfessionalScheduleResponse> schedules = professionalScheduleService.getSchedulesForProfessional(
                professional.getId());

        return ResponseEntity.ok(schedules);
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

    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest request,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User professional = userDetails.getUser();

        AppointmentResponse response = appointmentService.updateAppointmentStatus(
                appointmentId,
                request,
                professional);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/schedule")
    public ResponseEntity<ProfessionalScheduleResponse> updateMySchedule(
            @Valid @RequestBody UpdateProfessionalScheduleRequest request,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User professional = userDetails.getUser();

        ProfessionalScheduleResponse response = professionalScheduleService.updateSchedule(
                professional.getId(),
                request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfessionalProfileResponse> getProfile(
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(
                userService.getProfessionalProfile(userDetails.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfessionalProfileResponse> updateProfile(
            @Valid @RequestBody ProfessionalProfileUpdateRequest request,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(
                userService.updateProfessionalProfile(
                        userDetails.getId(),
                        request));
    }
}