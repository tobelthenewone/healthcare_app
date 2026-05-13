package com.healthcare.service;

import com.healthcare.dto.ProfessionalScheduleResponse;
import com.healthcare.dto.UpdateProfessionalScheduleRequest;
import com.healthcare.model.ProfessionalSchedule;
import com.healthcare.model.User;
import com.healthcare.model.UserRole;
import com.healthcare.repository.ProfessionalScheduleRepository;
import com.healthcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfessionalScheduleService {

    private final ProfessionalScheduleRepository professionalScheduleRepository;
    private final UserRepository userRepository;

    public ProfessionalScheduleResponse updateSchedule(
            Long professionalId,
            UpdateProfessionalScheduleRequest request
    ) {

        User professional = userRepository.findById(professionalId)
                .orElseThrow(() ->
                        new RuntimeException("Professional not found")
                );

        if (professional.getRole() != UserRole.PROFESSIONAL) {
            throw new RuntimeException("User is not a professional");
        }

        ProfessionalSchedule schedule =
                professionalScheduleRepository
                        .findByProfessionalAndDayOfWeek(
                                professional,
                                request.getDayOfWeek()
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Schedule not found")
                        );

        /*
         * Validate working hours
         */
        if (request.getEnabled()) {

            if (request.getStartHour() >= request.getEndHour()) {
                throw new RuntimeException(
                        "Start hour must be before end hour"
                );
            }

            /*
             * Validate break hours
             */
            if (request.getBreakStartHour() != null &&
                    request.getBreakEndHour() != null) {

                if (request.getBreakStartHour()
                        >= request.getBreakEndHour()) {

                    throw new RuntimeException(
                            "Break start must be before break end"
                    );
                }

                if (request.getBreakStartHour()
                        < request.getStartHour()
                        ||
                        request.getBreakEndHour()
                                > request.getEndHour()) {

                    throw new RuntimeException(
                            "Break must be inside working hours"
                    );
                }
            }
        }

        schedule.setEnabled(request.getEnabled());
        schedule.setStartHour(request.getStartHour());
        schedule.setEndHour(request.getEndHour());
        schedule.setBreakStartHour(request.getBreakStartHour());
        schedule.setBreakEndHour(request.getBreakEndHour());

        ProfessionalSchedule updated =
                professionalScheduleRepository.save(schedule);

        return mapToResponse(updated);
    }

    private ProfessionalScheduleResponse mapToResponse(
            ProfessionalSchedule schedule
    ) {

        return ProfessionalScheduleResponse.builder()
                .dayOfWeek(schedule.getDayOfWeek())
                .enabled(schedule.isEnabled())
                .startHour(schedule.getStartHour())
                .endHour(schedule.getEndHour())
                .breakStartHour(schedule.getBreakStartHour())
                .breakEndHour(schedule.getBreakEndHour())
                .build();
    }
}