package com.project.web_be.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScoreAssignmentResponse {
    private Long scoreId;
    private float score;
    private Long studentId;
    private String studentName;
    private String studentPhone;
}