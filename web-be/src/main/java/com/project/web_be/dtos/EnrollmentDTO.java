package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentDTO {
    @JsonProperty("class_id")
    private Long classId;
    @JsonProperty("phone_number")
    private String phoneNumber;
}
