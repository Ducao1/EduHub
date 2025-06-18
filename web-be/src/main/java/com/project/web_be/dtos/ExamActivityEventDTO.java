package com.project.web_be.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamActivityEventDTO {
    private Long examId;
    private Long classId;
    private Long studentId;
    private String activityType;
    private LocalDateTime timestamp;
}