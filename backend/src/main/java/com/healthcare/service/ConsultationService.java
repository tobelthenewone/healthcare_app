package com.healthcare.service;

import com.healthcare.dto.ConsultationResponse;
import com.healthcare.dto.CreateConsultationRequest;

import java.util.List;

public interface ConsultationService {

        boolean exists(Long appointmentId, Long professionalId);

        ConsultationResponse getPatientConsultation(Long consultationId,
                        Long patientId);

        ConsultationResponse update(Long consultationId,
                        Long professionalId,
                        CreateConsultationRequest request);

        ConsultationResponse create(Long appointmentId,
                        Long professionalId,
                        CreateConsultationRequest request);

        ConsultationResponse getByAppointment(Long appointmentId,
                        Long professionalId);

        List<ConsultationResponse> getPatientConsultations(Long patientId);
}