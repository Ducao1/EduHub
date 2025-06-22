package com.project.web_be.dtos.responses;

import com.project.web_be.dtos.AttachmentDTO;
import com.project.web_be.entities.Assignment;
import com.project.web_be.entities.Attachment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    private List<AttachmentDTO> attachments;
    private Long classId;
    private String className;

    public static AssignmentResponse fromAssignment(Assignment assignment){
        List<AttachmentDTO> attachmentDTOs = assignment.getAttachments() != null ?
                assignment.getAttachments().stream().map(attachment -> AttachmentDTO.builder()
                        .id(attachment.getId())
                        .fileName(attachment.getFileName())
                        .filePath(attachment.getFilePath())
                        .createdAt(attachment.getCreatedAt())
                        .updatedAt(attachment.getUpdatedAt())
                        .build()).collect(Collectors.toList()) : null;

        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .content(assignment.getContent())
                .teacher(assignment.getTeacher().getFullName())
                .assignedDate(assignment.getAssignedDate())
                .dueDate(assignment.getDueDate())
                .attachments(attachmentDTOs)
                .classId(assignment.getClassroom().getId())
                .className(assignment.getClassroom().getName())
                .build();
    }
}
