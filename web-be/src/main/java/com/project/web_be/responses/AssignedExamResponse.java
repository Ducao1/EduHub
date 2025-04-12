package com.project.web_be.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.web_be.entities.ClassExam;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class AssignedExamResponse {
    private Long id;
    private String title;
    @JsonProperty("class_id")
    private Long classId;
    @JsonProperty("exam_id")
    private Long examId;
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;

    public static AssignedExamResponse fromClassExam(ClassExam classExam) {
        return AssignedExamResponse.builder()
                .id(classExam.getId())
                .title(classExam.getExam().getTitle())
                .classId(classExam.getClassroom().getId())
                .examId(classExam.getExam().getId())
                .assignedDate(classExam.getAssignedDate())
                .dueDate(classExam.getDueDate())
                .build();
    }

}
