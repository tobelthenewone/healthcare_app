package com.healthcare.repository;

import com.healthcare.model.DayOfWeekEnum;
import com.healthcare.model.ProfessionalSchedule;
import com.healthcare.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessionalScheduleRepository
        extends JpaRepository<ProfessionalSchedule, Long> {

    Optional<ProfessionalSchedule> findByProfessionalAndDayOfWeek(
            User professional,
            DayOfWeekEnum dayOfWeek
    );
}