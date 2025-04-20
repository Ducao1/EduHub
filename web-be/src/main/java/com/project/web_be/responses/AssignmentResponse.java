package com.project.web_be.responses;

import com.project.web_be.entities.Assignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class AssignmentResponse {
    private Long id;
    private String title;
    private String content;
    private String teacher;
    private LocalDateTime assignedDate;
    private LocalDateTime dueDate;
    private String classroom;

    public static AssignmentResponse fromAssignment(Assignment assignment){
        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .content(assignment.getContent())
                .teacher(assignment.getTeacher().getFullName())
                .assignedDate(assignment.getAssignedDate())
                .dueDate(assignment.getDueDate())
                .classroom(assignment.getClassroom().getName())
                .build();
    }
}
