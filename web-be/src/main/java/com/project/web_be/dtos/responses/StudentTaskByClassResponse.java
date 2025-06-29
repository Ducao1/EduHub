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
public class StudentTaskByClassResponse {
    private Long classId;
    private String className;
    private String teacherName;
    private List<StudentTaskResponse> assignments;
    private List<StudentTaskResponse> exams;
    private TaskSummary summary;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskSummary {
        private int totalAssignments;
        private int submittedAssignments;
        private int gradedAssignments;
        private int totalExams;
        private int submittedExams;
        private int gradedExams;
        private double averageScore;
    }
} 