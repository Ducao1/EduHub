package com.project.web_be.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScoreAssignmentResponseDTO {
    private Long scoreId;
    private float score;
    private Long studentId;
    private String studentName;
    private String studentPhone;
} 