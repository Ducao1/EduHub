package com.project.web_be.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTaskResponse {
    private Long id;
    private String title;
    private String type; // "ASSIGNMENT" hoặc "EXAM"
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;
    private String teacherName;
    private String className;
    private boolean isSubmitted;
    private LocalDateTime submittedAt;
    private Double score;
    private String status; // "NOT_SUBMITTED", "SUBMITTED", "GRADED", "LATE"
} 