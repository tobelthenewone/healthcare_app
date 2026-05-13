package com.healthcare.dto;

import com.healthcare.model.DayOfWeekEnum;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfessionalScheduleRequest {

    @NotNull
    private DayOfWeekEnum dayOfWeek;

    @NotNull
    private Boolean enabled;

    @Min(0)
    @Max(23)
    private Integer startHour;

    @Min(1)
    @Max(24)
    private Integer endHour;

    @Min(0)
    @Max(23)
    private Integer breakStartHour;

    @Min(1)
    @Max(24)
    private Integer breakEndHour;
}