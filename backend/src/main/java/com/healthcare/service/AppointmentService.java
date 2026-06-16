package com.healthcare.service;

import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.AvailableSlotResponse;
import com.healthcare.dto.BookAppointmentRequest;
import com.healthcare.dto.PagedResponse;
import com.healthcare.dto.UpdateAppointmentStatusRequest;
import com.healthcare.model.Appointment;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.model.DayOfWeekEnum;
import com.healthcare.model.ProfessionalSchedule;
import com.healthcare.model.User;
import com.healthcare.model.UserRole;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.ProfessionalScheduleRepository;
import com.healthcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;
import com.healthcare.dto.AppointmentFilterRequest;
import com.healthcare.specification.AppointmentSpecification;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentService {

        private final ProfessionalScheduleRepository professionalScheduleRepository;
        private final AppointmentRepository appointmentRepository;
        private final UserRepository userRepository;

        private static final int SLOT_DURATION_MINUTES = 30;
        private static final ZoneId ZONE = ZoneId.of("UTC");

        public PagedResponse<AppointmentResponse> getAppointmentsByStatus(
                        AppointmentStatus status,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by("appointmentTime").descending());

                Page<Appointment> appointmentPage = appointmentRepository.findByStatus(
                                status,
                                pageable);

                List<AppointmentResponse> responses = appointmentPage.getContent()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();

                return PagedResponse.<AppointmentResponse>builder()
                                .content(responses)
                                .page(appointmentPage.getNumber())
                                .size(appointmentPage.getSize())
                                .totalElements(appointmentPage.getTotalElements())
                                .totalPages(appointmentPage.getTotalPages())
                                .last(appointmentPage.isLast())
                                .build();
        }

        private boolean isValidSlot(
                        Instant appointmentTime,
                        ProfessionalSchedule schedule) {

                /*
                 * Normalize slot
                 */
                Instant normalized = normalizeToSlot(appointmentTime);

                /*
                 * Must match slot boundary exactly
                 */
                if (!normalized.equals(appointmentTime)) {
                        return false;
                }

                /*
                 * Convert to local time
                 */
                LocalDateTime localDateTime = appointmentTime.atZone(ZONE).toLocalDateTime();

                int hour = localDateTime.getHour();
                int minute = localDateTime.getMinute();

                /*
                 * Must be within working hours
                 */
                if (hour < schedule.getStartHour() ||
                                hour >= schedule.getEndHour()) {
                        return false;
                }
                if (schedule.getBreakStartHour() != null &&
                                schedule.getBreakEndHour() != null) {

                        if (hour >= schedule.getBreakStartHour()
                                        &&
                                        hour < schedule.getBreakEndHour()) {

                                return false;
                        }
                }
                /*
                 * Must align with slot duration (e.g. 00 or 30)
                 */
                if (minute % SLOT_DURATION_MINUTES != 0) {
                        return false;
                }

                /*
                 * Must be in the future
                 */
                if (appointmentTime.isBefore(Instant.now())) {
                        return false;
                }

                return true;
        }

        private Instant normalizeToSlot(Instant time) {
                long epochSeconds = time.getEpochSecond();

                long slotSize = 30 * 60; // 30 minutes

                long normalized = (epochSeconds / slotSize) * slotSize;

                return Instant.ofEpochSecond(normalized);
        }

        public List<AvailableSlotResponse> getAvailableSlots(
                        Long professionalId,
                        Instant date) {

                User professional = userRepository.findById(professionalId)
                                .orElseThrow(() -> new RuntimeException("Professional not found"));

                if (professional.getRole() != UserRole.PROFESSIONAL) {
                        throw new RuntimeException("User is not a professional");
                }

                /*
                 * Convert input date → LocalDate (UTC)
                 */
                LocalDate localDate = date.atZone(ZONE).toLocalDate();

                DayOfWeekEnum dayOfWeek = DayOfWeekEnum.valueOf(
                                localDate.getDayOfWeek().name());
                ProfessionalSchedule schedule = professionalScheduleRepository
                                .findByProfessionalAndDayOfWeek(
                                                professional,
                                                dayOfWeek)
                                .orElseThrow(() -> new RuntimeException("Schedule not found"));
                if (!schedule.isEnabled()) {
                        return List.of();
                }
                /*
                 * Define working hours
                 */
                int startHour = schedule.getStartHour();
                int endHour = schedule.getEndHour();

                LocalDateTime startOfWork = localDate.atTime(startHour, 0);
                LocalDateTime endOfWork = localDate.atTime(endHour, 0);

                Instant startInstant = startOfWork.atZone(ZONE).toInstant();
                Instant endInstant = endOfWork.atZone(ZONE).toInstant();

                /*
                 * Fetch existing appointments within working hours
                 */
                List<Appointment> existingAppointments = appointmentRepository
                                .findByProfessionalAndAppointmentTimeBetween(
                                                professional,
                                                startInstant,
                                                endInstant);

                /*
                 * Normalize booked slots
                 */
                Set<Instant> bookedSlots = existingAppointments.stream()
                                .map(Appointment::getAppointmentTime)
                                .map(this::normalizeToSlot)
                                .collect(Collectors.toSet());

                /*
                 * Generate slots
                 */
                List<AvailableSlotResponse> availableSlots = new ArrayList<>();

                Instant now = Instant.now();

                Instant current = startInstant;

                while (current.isBefore(endInstant)) {

                        Instant next = current.plusSeconds(SLOT_DURATION_MINUTES * 60);

                        Instant normalizedCurrent = normalizeToSlot(current);

                        /*
                         * Skip:
                         * 1. Already booked
                         * 2. Past time (only if date is today)
                         */
                        boolean isBooked = bookedSlots.contains(normalizedCurrent);
                        boolean isPast = current.isBefore(now);
                        int currentHour = LocalDateTime.ofInstant(current, ZONE).getHour();

                        if (schedule.getBreakStartHour() != null &&
                                        schedule.getBreakEndHour() != null) {

                                if (currentHour >= schedule.getBreakStartHour()
                                                &&
                                                currentHour < schedule.getBreakEndHour()) {

                                        current = current.plus(Duration.ofMinutes(SLOT_DURATION_MINUTES));
                                        continue;
                                }
                        }
                        if (!isBooked && !isPast) {
                                availableSlots.add(
                                                AvailableSlotResponse.builder()
                                                                .startTime(current)
                                                                .endTime(next)
                                                                .build());
                        }

                        current = next;
                }

                return availableSlots;
        }

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

                LocalDate localDate = request.getAppointmentTime()
                                .atZone(ZONE)
                                .toLocalDate();
                DayOfWeekEnum dayOfWeek = DayOfWeekEnum.valueOf(
                                localDate.getDayOfWeek().name());
                ProfessionalSchedule schedule = professionalScheduleRepository
                                .findByProfessionalAndDayOfWeek(
                                                professional,
                                                dayOfWeek)
                                .orElseThrow(() -> new RuntimeException("Schedule not found"));

                if (!isValidSlot(request.getAppointmentTime(), schedule)) {
                        throw new RuntimeException("Invalid appointment time slot");
                }
                /*
                 * Ensure target user is PROFESSIONAL
                 */
                if (professional.getRole() != UserRole.PROFESSIONAL) {
                        throw new RuntimeException("Selected user is not a professional");
                }

                if (!schedule.isEnabled()) {
                        throw new RuntimeException(
                                        "Professional is unavailable on this day");
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

                try {
                        Appointment savedAppointment = appointmentRepository.save(appointment);

                        return mapToResponse(savedAppointment);

                } catch (DataIntegrityViolationException e) {
                        throw new RuntimeException("Slot already booked. Please choose another time.");
                }

                /*
                 * Convert to response DTO
                 */
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

        public AppointmentResponse updateAppointmentStatus(
                        Long appointmentId,
                        UpdateAppointmentStatusRequest request,
                        User professional) {

                Appointment appointment = appointmentRepository
                                .findByIdAndProfessional(appointmentId, professional)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                AppointmentStatus currentStatus = appointment.getStatus();
                AppointmentStatus newStatus = request.getStatus();

                /*
                 * Prevent modifying finished appointments
                 */
                if (currentStatus == AppointmentStatus.CANCELLED ||
                                currentStatus == AppointmentStatus.REJECTED ||
                                currentStatus == AppointmentStatus.COMPLETED) {

                        throw new RuntimeException(
                                        "Cannot modify finalized appointment");
                }

                /*
                 * Allowed professional transitions:
                 *
                 * PENDING -> CONFIRMED
                 * PENDING -> REJECTED
                 * CONFIRMED -> COMPLETED
                 */
                boolean validTransition =

                                (currentStatus == AppointmentStatus.PENDING &&
                                                (newStatus == AppointmentStatus.CONFIRMED ||
                                                                newStatus == AppointmentStatus.REJECTED))

                                                ||

                                                (currentStatus == AppointmentStatus.CONFIRMED &&
                                                                newStatus == AppointmentStatus.COMPLETED);

                if (!validTransition) {
                        throw new RuntimeException(
                                        "Invalid appointment status transition");
                }

                appointment.setStatus(newStatus);

                Appointment updatedAppointment = appointmentRepository.save(appointment);

                return mapToResponse(updatedAppointment);
        }

        public AppointmentResponse cancelAppointment(
                        Long appointmentId,
                        User patient) {

                Appointment appointment = appointmentRepository
                                .findByIdAndPatient(appointmentId, patient)
                                .orElseThrow(() -> new RuntimeException("Appointment not found"));

                AppointmentStatus currentStatus = appointment.getStatus();

                /*
                 * Prevent cancelling finalized appointments
                 */
                if (currentStatus == AppointmentStatus.COMPLETED ||
                                currentStatus == AppointmentStatus.CANCELLED ||
                                currentStatus == AppointmentStatus.REJECTED) {

                        throw new RuntimeException(
                                        "Appointment cannot be cancelled");
                }

                appointment.setStatus(AppointmentStatus.CANCELLED);

                Appointment updatedAppointment = appointmentRepository.save(appointment);

                return mapToResponse(updatedAppointment);
        }

        public PagedResponse<AppointmentResponse> filterAppointments(
                        AppointmentFilterRequest filter,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by("appointmentTime").descending());

                Page<Appointment> appointmentPage = appointmentRepository.findAll(
                                AppointmentSpecification
                                                .filterAppointments(filter),
                                pageable);

                List<AppointmentResponse> responses = appointmentPage.getContent()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();

                return PagedResponse.<AppointmentResponse>builder()
                                .content(responses)
                                .page(appointmentPage.getNumber())
                                .size(appointmentPage.getSize())
                                .totalElements(appointmentPage.getTotalElements())
                                .totalPages(appointmentPage.getTotalPages())
                                .last(appointmentPage.isLast())
                                .build();
        }
}