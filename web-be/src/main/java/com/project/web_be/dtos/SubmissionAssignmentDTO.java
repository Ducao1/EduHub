package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubmissionAssignmentDTO {
    private LocalDateTime submittedAt = LocalDateTime.now();
    @JsonProperty("assignment_id")
    private Long assignmentId;
    @JsonProperty("student_id")
    private Long studentId;
    @JsonProperty("file_path")
    private String filePath;
}
