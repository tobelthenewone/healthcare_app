package com.healthcare.controller;

import com.healthcare.security.CustomUserDetails;
import com.healthcare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.healthcare.dto.UpdateProfileRequest;
import com.healthcare.dto.UserProfileResponse;
import com.healthcare.dto.ChangePasswordRequest;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor

public class PatientController {
    private final UserService userService;

    // Dashboard (UI-style message)
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/dashboard")
    public String patientDashboard(@AuthenticationPrincipal CustomUserDetails user) {
        return "Welcome Patient: " + user.getFullName();
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