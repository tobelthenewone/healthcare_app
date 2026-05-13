package com.healthcare.repository;

import com.healthcare.model.Appointment;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AppointmentRepository extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {

        boolean existsByProfessionalAndAppointmentTime(
                        User professional,
                        Instant appointmentTime);

        List<Appointment> findByPatientOrderByAppointmentTimeDesc(User patient);

        List<Appointment> findByProfessionalOrderByAppointmentTimeDesc(User professional);

        List<Appointment> findByProfessionalAndAppointmentTimeBetween(
                        User professional,
                        Instant start,
                        Instant end);

        List<Appointment> findByProfessionalAndStatus(
                        User professional,
                        AppointmentStatus status);

        Optional<Appointment> findByIdAndProfessional(
                        Long id,
                        User professional);

        Optional<Appointment> findByIdAndPatient(
                        Long id,
                        User patient);

        Page<Appointment> findByPatient(
                        User patient,
                        Pageable pageable);

        Page<Appointment> findByProfessional(
                        User professional,
                        Pageable pageable);

        Page<Appointment> findByStatus(
                        AppointmentStatus status,
                        Pageable pageable);

        List<Appointment> findAllByStatus(AppointmentStatus status);
}