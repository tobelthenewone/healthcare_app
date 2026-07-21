package com.healthcare.repository;

import com.healthcare.model.ConsultationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultationRecordRepository extends JpaRepository<ConsultationRecord, Long> {

    Optional<ConsultationRecord> findByAppointmentId(Long appointmentId);

    boolean existsByAppointmentId(Long appointmentId);

    List<ConsultationRecord> findByAppointmentProfessionalIdOrderByAppointmentAppointmentTimeDesc(
            Long professionalId);

    List<ConsultationRecord> findByAppointmentPatientIdOrderByAppointmentAppointmentTimeDesc(Long patientId);

    long countByAppointmentPatientId(Long patientId);
}