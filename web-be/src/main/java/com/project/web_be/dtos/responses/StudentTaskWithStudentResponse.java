package com.project.web_be.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTaskWithStudentResponse {
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private List<StudentTaskByClassResponse> classTasks;
    private OverallSummary overallSummary;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverallSummary {
        private int totalClasses;
        private int totalAssignments;
        private int submittedAssignments;
        private int gradedAssignments;
        private int totalExams;
        private int submittedExams;
        private int gradedExams;
        private double overallAverageScore;
    }
} 