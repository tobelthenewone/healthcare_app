package com.healthcare.service;

import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.BookAppointmentRequest;
import com.healthcare.model.Appointment;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.model.User;
import com.healthcare.model.UserRole;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

        private final AppointmentRepository appointmentRepository;
        private final UserRepository userRepository;

        public List<AppointmentResponse> getPatientAppointments(User patient) {

                return appointmentRepository
                                .findByPatientOrderByAppointmentTimeDesc(patient)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        public List<AppointmentResponse> getProfessionalAppointments(User professional) {

                return appointmentRepository
                                .findByProfessionalOrderByAppointmentTimeDesc(professional)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        public AppointmentResponse bookAppointment(
                        BookAppointmentRequest request,
                        User patient) {

                /*
                 * Find professional
                 */
                User professional = userRepository.findById(request.getProfessionalId())
                                .orElseThrow(() -> new RuntimeException("Professional not found"));

                /*
                 * Ensure target user is PROFESSIONAL
                 */
                if (professional.getRole() != UserRole.PROFESSIONAL) {
                        throw new RuntimeException("Selected user is not a professional");
                }

                /*
                 * Prevent self-booking
                 */
                if (professional.getId().equals(patient.getId())) {
                        throw new RuntimeException("You cannot book yourself");
                }

                /*
                 * Prevent double booking
                 */
                boolean alreadyBooked = appointmentRepository.existsByProfessionalAndAppointmentTime(
                                professional,
                                request.getAppointmentTime());

                if (alreadyBooked) {
                        throw new RuntimeException(
                                        "This appointment slot is already booked");
                }

                /*
                 * Create appointment
                 */
                Appointment appointment = Appointment.builder()
                                .patient(patient)
                                .professional(professional)
                                .appointmentTime(request.getAppointmentTime())
                                .reason(request.getReason())
                                .status(AppointmentStatus.PENDING)
                                .build();

                Appointment savedAppointment = appointmentRepository.save(appointment);

                /*
                 * Convert to response DTO
                 */
                return mapToResponse(savedAppointment);
        }

        private AppointmentResponse mapToResponse(Appointment appointment) {

                return AppointmentResponse.builder()
                                .id(appointment.getId())

                                .patientId(appointment.getPatient().getId())
                                .patientName(appointment.getPatient().getFullName())

                                .professionalId(appointment.getProfessional().getId())
                                .professionalName(appointment.getProfessional().getFullName())

                                .appointmentTime(appointment.getAppointmentTime())

                                .status(appointment.getStatus())

                                .reason(appointment.getReason())

                                .createdAt(appointment.getCreatedAt())
                                .build();
        }
}