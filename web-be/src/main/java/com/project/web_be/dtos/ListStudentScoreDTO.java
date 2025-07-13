package com.project.web_be.dtos;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListStudentScoreDTO {
    private Long studentId;
    private String studentName;
    private List<SubmissionScoreDTO> submissions;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubmissionScoreDTO {
        private String type; // "ASSIGNMENT" hoặc "EXAM"
        private Long id; // assignmentId hoặc examId
        private String title;
        private Float score; // null nếu chưa có điểm
    }
} 