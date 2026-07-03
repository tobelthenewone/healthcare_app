package com.healthcare.controller;

import com.healthcare.dto.ConsultationResponse;
import com.healthcare.dto.CreateConsultationRequest;
import com.healthcare.security.CustomUserDetails;
import com.healthcare.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ConsultationController {

    private final ConsultationService consultationService;

    @GetMapping("/patient/consultations/{consultationId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ConsultationResponse getPatientConsultation(
            @PathVariable Long consultationId,
            @AuthenticationPrincipal CustomUserDetails user) {

        return consultationService.getPatientConsultation(
                consultationId,
                user.getId());
    }

    @PostMapping("/professional/appointments/{appointmentId}/consultation")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ConsultationResponse createConsultation(
            @PathVariable Long appointmentId,
            @Valid @RequestBody CreateConsultationRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        return consultationService.create(
                appointmentId,
                user.getId(),
                request);
    }

    @PutMapping("/professional/consultations/{consultationId}")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ConsultationResponse updateConsultation(
            @PathVariable Long consultationId,
            @Valid @RequestBody CreateConsultationRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

        return consultationService.update(
                consultationId,
                user.getId(),
                request);
    }

    @GetMapping("/professional/appointments/{appointmentId}/consultation")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ConsultationResponse getProfessionalConsultation(
            @PathVariable Long appointmentId,
            @AuthenticationPrincipal CustomUserDetails user) {

        return consultationService.getByAppointment(
                appointmentId,
                user.getId());
    }

    @GetMapping("/patient/consultations")
    @PreAuthorize("hasRole('PATIENT')")
    public List<ConsultationResponse> getPatientConsultations(
            @AuthenticationPrincipal CustomUserDetails user) {

        return consultationService.getPatientConsultations(user.getId());
    }
}