package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAssignmentDateDTO {
    @JsonProperty("assigned_date")
    private LocalDateTime assignedDate;
    @JsonProperty("due_date")
    private LocalDateTime dueDate;
}
