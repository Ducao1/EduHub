package com.project.web_be.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamResultDTO {
    private Long submissionId;
    private String examTitle;
    private String studentName;
    private LocalDateTime submittedAt;
    private Integer correctCount;
    private Integer totalCount;
    private Float score;
} 