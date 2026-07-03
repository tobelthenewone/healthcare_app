package com.healthcare.service.impl;

import com.healthcare.dto.ConsultationResponse;
import com.healthcare.dto.CreateConsultationRequest;
import com.healthcare.model.Appointment;
import com.healthcare.model.AppointmentStatus;
import com.healthcare.model.ConsultationRecord;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.ConsultationRecordRepository;
import com.healthcare.service.ConsultationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultationServiceImpl implements ConsultationService {

    private final AppointmentRepository appointmentRepository;
    private final ConsultationRecordRepository consultationRepository;

    @Override
    public ConsultationResponse getPatientConsultation(Long consultationId,
            Long patientId) {

        ConsultationRecord consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));

        if (!consultation.getAppointment()
                .getPatient()
                .getId()
                .equals(patientId)) {

            throw new IllegalStateException("Access denied.");
        }

        return mapToResponse(consultation);
    }

    @Override
    public ConsultationResponse update(Long consultationId,
            Long professionalId,
            CreateConsultationRequest request) {

        ConsultationRecord consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));

        if (!consultation.getAppointment()
                .getProfessional()
                .getId()
                .equals(professionalId)) {

            throw new IllegalStateException("Access denied.");
        }

        consultation.setDiagnosis(request.getDiagnosis());
        consultation.setPrescription(request.getPrescription());
        consultation.setRecommendations(request.getRecommendations());
        consultation.setNotes(request.getNotes());

        consultationRepository.save(consultation);

        return mapToResponse(consultation);
    }

    @Override
    public ConsultationResponse create(Long appointmentId,
            Long professionalId,
            CreateConsultationRequest request) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        if (!appointment.getProfessional().getId().equals(professionalId)) {
            throw new IllegalStateException("You cannot create a consultation for this appointment.");
        }

        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Appointment is not completed.");
        }

        if (consultationRepository.existsByAppointmentId(appointmentId)) {
            throw new IllegalStateException("Consultation already exists.");
        }

        ConsultationRecord consultation = ConsultationRecord.builder()
                .appointment(appointment)
                .diagnosis(request.getDiagnosis())
                .prescription(request.getPrescription())
                .recommendations(request.getRecommendations())
                .notes(request.getNotes())
                .build();

        consultationRepository.save(consultation);

        return mapToResponse(consultation);
    }

    @Override
    public ConsultationResponse getByAppointment(Long appointmentId,
            Long professionalId) {

        ConsultationRecord consultation = consultationRepository
                .findByAppointmentId(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));

        if (!consultation.getAppointment()
                .getProfessional()
                .getId()
                .equals(professionalId)) {

            throw new IllegalStateException("Access denied.");
        }

        return mapToResponse(consultation);
    }

    @Override
    public List<ConsultationResponse> getPatientConsultations(Long patientId) {

        return consultationRepository
                .findByAppointmentPatientIdOrderByAppointmentAppointmentTimeDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ConsultationResponse mapToResponse(ConsultationRecord consultation) {

        Appointment appointment = consultation.getAppointment();

        return ConsultationResponse.builder()
                .id(consultation.getId())
                .appointmentId(appointment.getId())
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getFullName())
                .professionalId(appointment.getProfessional().getId())
                .professionalName(appointment.getProfessional().getFullName())
                .appointmentTime(appointment.getAppointmentTime())
                .diagnosis(consultation.getDiagnosis())
                .prescription(consultation.getPrescription())
                .recommendations(consultation.getRecommendations())
                .notes(consultation.getNotes())
                .createdAt(consultation.getCreatedAt())
                .updatedAt(consultation.getUpdatedAt())
                .build();
    }
}