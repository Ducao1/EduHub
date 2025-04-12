package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentDTO {
    @JsonProperty("title")
    private String title;
    @JsonProperty("content")
    private String content;
    @JsonProperty("assigned_date")
    private LocalDateTime assignedDate;
    @JsonProperty("due_date")
    private LocalDateTime dueDate;
    @JsonProperty("teacher_id")
    private long teacherId;
    @JsonProperty("class_id")
    private long classId;
}
