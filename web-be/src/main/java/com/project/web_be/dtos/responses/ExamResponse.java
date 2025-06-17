package com.project.web_be.dtos.responses;

import com.project.web_be.entities.Exam;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class ExamResponse {
    private Long id;
    private String title;
    private String teacher;
    private Long duration;
    private List<QuestionResponse> questions;
    private Long classId;

    public static ExamResponse fromExam(Exam exam, Long classId) {
        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .teacher(exam.getTeacher() != null ? exam.getTeacher().getFullName() : null)
                .duration(exam.getDuration())
                .questions(exam.getQuestions() != null ?
                        exam.getQuestions().stream()
                                .map(QuestionResponse::fromQuestion)
                                .collect(Collectors.toList()) : null)
                .classId(classId)
                .build();
    }
}