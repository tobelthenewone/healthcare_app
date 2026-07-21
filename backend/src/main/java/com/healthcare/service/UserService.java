package com.healthcare.service;

import com.healthcare.dto.ChangePasswordRequest;
import com.healthcare.dto.PatientProfileResponse;
import com.healthcare.dto.UpdateProfileRequest;
import com.healthcare.dto.UserProfileResponse;
import com.healthcare.dto.ProfessionalResponse;
import com.healthcare.dto.UpdatePatientProfileRequest;
import com.healthcare.dto.ProfessionalProfileUpdateRequest;
import com.healthcare.dto.ProfessionalProfileResponse;
import com.healthcare.model.User;
import com.healthcare.model.UserRole;
import com.healthcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.healthcare.dto.AdminDashboardResponse;
import com.healthcare.dto.PatientDashboardResponse;
import com.healthcare.dto.ProfessionalDashboardResponse;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.model.UserRole;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.ConsultationRecordRepository;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AppointmentRepository appointmentRepository;

    private final ConsultationRecordRepository consultationRecordRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.isEnabled());
    }

    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow();

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.isEnabled());
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId).orElseThrow();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChangedAt(Instant.now());

        userRepository.save(user);
    }

    public List<ProfessionalResponse> getProfessionals() {

        return userRepository
                .findByRole(UserRole.PROFESSIONAL)
                .stream()
                .map(user -> new ProfessionalResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getSpecialties(),
                        user.getDescription()))
                .toList();
    }

    public ProfessionalProfileResponse getProfessionalProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        return ProfessionalProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .specialties(user.getSpecialties())
                .description(user.getDescription())
                .build();
    }

    public ProfessionalProfileResponse updateProfessionalProfile(
            Long userId,
            ProfessionalProfileUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        user.setSpecialties(request.getSpecialties());
        user.setDescription(request.getDescription());

        userRepository.save(user);

        return ProfessionalProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .specialties(user.getSpecialties())
                .description(user.getDescription())
                .build();
    }

    private PatientProfileResponse toPatientProfile(User user) {

        return PatientProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .bloodGroup(user.getBloodGroup())
                .allergies(user.getAllergies())
                .medicalNotes(user.getMedicalNotes())
                .build();
    }

    public PatientProfileResponse getPatientProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        return toPatientProfile(user);
    }

    public PatientProfileResponse updatePatientProfile(
            Long userId,
            UpdatePatientProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        user.setDateOfBirth(request.getDateOfBirth());
        user.setBloodGroup(request.getBloodGroup());
        user.setAllergies(request.getAllergies());
        user.setMedicalNotes(request.getMedicalNotes());

        userRepository.save(user);

        return toPatientProfile(user);
    }

    public PatientDashboardResponse getPatientDashboard(User patient) {

        return new PatientDashboardResponse(
                appointmentRepository.countByPatientAndStatus(
                        patient,
                        AppointmentStatus.PENDING)
                        +
                        appointmentRepository.countByPatientAndStatus(
                                patient,
                                AppointmentStatus.CONFIRMED),

                appointmentRepository.countByPatientAndStatus(
                        patient,
                        AppointmentStatus.COMPLETED),

                consultationRecordRepository.countByAppointmentPatientId(
                        patient.getId()));
    }

    public ProfessionalDashboardResponse getProfessionalDashboard(User professional) {

        Instant startOfDay = LocalDate.now()
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);

        Instant endOfDay = startOfDay.plusSeconds(86400);

        return new ProfessionalDashboardResponse(

                appointmentRepository.countByProfessionalAndAppointmentTimeBetween(
                        professional,
                        startOfDay,
                        endOfDay),

                appointmentRepository.countByProfessionalAndStatus(
                        professional,
                        AppointmentStatus.PENDING),

                appointmentRepository.countByProfessionalAndStatus(
                        professional,
                        AppointmentStatus.COMPLETED));
    }

    public AdminDashboardResponse getAdminDashboard() {

        return new AdminDashboardResponse(

                userRepository.count(),

                userRepository.countByRole(UserRole.PATIENT),

                userRepository.countByRole(UserRole.PROFESSIONAL),

                appointmentRepository.count());
    }
}