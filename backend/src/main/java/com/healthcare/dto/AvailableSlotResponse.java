package com.healthcare.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class AvailableSlotResponse {

    private Instant startTime;
    private Instant endTime;
}