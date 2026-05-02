package com.healthcare.repository;

import com.healthcare.model.Appointment;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        boolean existsByProfessionalAndAppointmentTime(
                        User professional,
                        Instant appointmentTime);

        List<Appointment> findByPatientOrderByAppointmentTimeDesc(User patient);

        List<Appointment> findByProfessionalOrderByAppointmentTimeDesc(User professional);

        List<Appointment> findByProfessionalAndStatus(
                        User professional,
                        AppointmentStatus status);
}