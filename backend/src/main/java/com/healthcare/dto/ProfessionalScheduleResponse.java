package com.healthcare.dto;

import com.healthcare.model.DayOfWeekEnum;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfessionalScheduleResponse {

    private DayOfWeekEnum dayOfWeek;

    private boolean enabled;

    private Integer startHour;

    private Integer endHour;

    private Integer breakStartHour;

    private Integer breakEndHour;
}