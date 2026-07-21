package com.healthcare.controller;

import com.healthcare.security.CustomUserDetails;
import com.healthcare.service.AppointmentService;
import com.healthcare.service.UserService;
import com.healthcare.model.User;
import java.time.Instant;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.healthcare.dto.ProfessionalResponse;
import com.healthcare.dto.UpdateProfileRequest;
import com.healthcare.dto.UserProfileResponse;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.AvailableSlotResponse;
import com.healthcare.dto.BookAppointmentRequest;
import com.healthcare.dto.ChangePasswordRequest;
import com.healthcare.dto.PatientDashboardResponse;
import com.healthcare.dto.PatientProfileResponse;
import com.healthcare.dto.UpdatePatientProfileRequest;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor

public class PatientController {
    private final UserService userService;
    private final AppointmentService appointmentService;

    // Dashboard (UI-style message)
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/dashboard")
    public PatientDashboardResponse getDashboard(
            @AuthenticationPrincipal CustomUserDetails user) {

        return userService.getPatientDashboard(user.getUser());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User patient = userDetails.getUser();

        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(patient);

        return ResponseEntity.ok(appointments);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @Valid @RequestBody BookAppointmentRequest request,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User patient = userDetails.getUser();

        AppointmentResponse response = appointmentService.bookAppointment(request, patient);

        return ResponseEntity.ok(response);
    }

    // Secure endpoint (REAL data access)
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")

    public UserProfileResponse getMyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return userService.getMyProfile(user.getId());
    }

    @PutMapping("/me")
    public UserProfileResponse updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody UpdateProfileRequest request) {

        return userService.updateProfile(user.getId(), request);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/profile")
    public PatientProfileResponse getPatientProfile(
            @AuthenticationPrincipal CustomUserDetails user) {

        return userService.getPatientProfile(user.getId());
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PutMapping("/profile")
    public PatientProfileResponse updatePatientProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody UpdatePatientProfileRequest request) {

        return userService.updatePatientProfile(
                user.getId(),
                request);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PutMapping("/change-password")
    public String changePassword(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(user.getId(), request);
        return "Password updated successfully";
    }

    public String getMyData(@AuthenticationPrincipal CustomUserDetails user) {
        return "Fetching data for user ID: " + user.getId();
    }

    @PutMapping("/appointments/{appointmentId}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication) {

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User patient = userDetails.getUser();

        AppointmentResponse response = appointmentService.cancelAppointment(
                appointmentId,
                patient);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments/available-slots")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(
            @RequestParam Long professionalId,
            @RequestParam Instant date) {

        List<AvailableSlotResponse> slots = appointmentService.getAvailableSlots(professionalId, date);

        return ResponseEntity.ok(slots);
    }

    @GetMapping("/professionals")
    public ResponseEntity<List<ProfessionalResponse>> getProfessionals() {

        return ResponseEntity.ok(
                userService.getProfessionals());
    }
}