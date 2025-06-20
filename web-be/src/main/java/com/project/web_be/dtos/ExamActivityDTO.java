package com.project.web_be.dtos;

import com.project.web_be.entities.ExamActivity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamActivityDTO {
    private Long id;
    private Long examId;
    private Long classId;
    private Long studentId;
    private String activityType;
    private LocalDateTime timestamp;

    public static ExamActivityDTO fromEntity(ExamActivity entity) {
        return ExamActivityDTO.builder()
                .id(entity.getId())
                .examId(entity.getExamId())
                .classId(entity.getClassId())
                .studentId(entity.getStudentId())
                .activityType(String.valueOf(entity.getActivityType()))
                .timestamp(entity.getTimestamp())
                .build();
    }
} 