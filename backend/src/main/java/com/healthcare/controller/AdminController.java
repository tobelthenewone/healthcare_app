package com.healthcare.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.healthcare.security.CustomUserDetails;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public String adminDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        return "Welcome Admin: " + userDetails.getUsername();
    }

     // Secure endpoint (REAL data access)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/me")
    public String getMyData(@AuthenticationPrincipal CustomUserDetails user) {
        return "Fetching data for user ID: " + user.getId();
    }
}