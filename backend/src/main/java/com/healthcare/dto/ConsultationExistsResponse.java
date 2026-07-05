package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConsultationExistsResponse {

    private boolean exists;

}