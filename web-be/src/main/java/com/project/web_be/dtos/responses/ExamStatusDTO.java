package com.project.web_be.dtos.responses;

import com.project.web_be.entities.ExamStatus;
import com.project.web_be.dtos.enums.ExamStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamStatusDTO {
    private Long examId;
    private Long studentId;
    private ExamStatusType status;
    private LocalDateTime startTime;
    private LocalDateTime submitTime;

    public static ExamStatusDTO fromEntity(ExamStatus entity) {
        return ExamStatusDTO.builder()
                .examId(entity.getExam() != null ? entity.getExam().getId() : null)
                .studentId(entity.getStudent() != null ? entity.getStudent().getId() : null)
                .status(entity.getStatus())
                .startTime(entity.getStartTime())
                .submitTime(entity.getSubmitTime())
                .build();
    }
} 