package com.healthcare.controller;

import com.healthcare.security.CustomUserDetails;
import com.healthcare.service.AppointmentService;
import com.healthcare.service.UserService;
import com.healthcare.model.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthcare.dto.UpdateProfileRequest;
import com.healthcare.dto.UserProfileResponse;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.BookAppointmentRequest;
import com.healthcare.dto.ChangePasswordRequest;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor

public class PatientController {
    private final UserService userService;
    private final AppointmentService appointmentService;

    // Dashboard (UI-style message)
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/dashboard")
    public String patientDashboard(@AuthenticationPrincipal CustomUserDetails user) {
        return "Welcome Patient: " + user.getFullName();
    }
    
    @PreAuthorize("hasRole('PATIENT')")
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
}