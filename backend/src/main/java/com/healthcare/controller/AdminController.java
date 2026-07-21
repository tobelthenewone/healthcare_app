package com.healthcare.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.healthcare.dto.UserProfileResponse;
import com.healthcare.service.AdminService;
import com.healthcare.service.ProfessionalScheduleService;
import com.healthcare.service.UserService;

import lombok.RequiredArgsConstructor;

import com.healthcare.dto.ProfessionalScheduleResponse;
import com.healthcare.dto.UpdateProfessionalScheduleRequest;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.PagedResponse;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.service.AppointmentService;
import com.healthcare.dto.AdminDashboardResponse;
import com.healthcare.dto.AppointmentFilterRequest;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ProfessionalScheduleService professionalScheduleService;
    private final AppointmentService appointmentService;
    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return userService.getAdminDashboard();
    }

    // Get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserProfileResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    // Get user by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}")
    public UserProfileResponse getUser(@PathVariable Long id) {
        return adminService.getUserById(id);
    }

    // Delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return "User deleted successfully";
    }

    @PutMapping("/professionals/{professionalId}/schedule")
    public ResponseEntity<ProfessionalScheduleResponse> updateProfessionalSchedule(
            @PathVariable Long professionalId,
            @Valid @RequestBody UpdateProfessionalScheduleRequest request) {

        ProfessionalScheduleResponse response = professionalScheduleService.updateSchedule(
                professionalId,
                request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments")
    public ResponseEntity<PagedResponse<AppointmentResponse>> getAppointmentsByStatus(

            @RequestParam AppointmentStatus status,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<AppointmentResponse> response = appointmentService.getAppointmentsByStatus(
                status,
                page,
                size);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments/filter")
    public ResponseEntity<PagedResponse<AppointmentResponse>> filterAppointments(

            AppointmentFilterRequest filter,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<AppointmentResponse> response = appointmentService.filterAppointments(
                filter,
                page,
                size);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserProfileResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled) {

        UserProfileResponse response = adminService.updateUserStatus(
                id,
                enabled);

        return ResponseEntity.ok(response);
    }
}