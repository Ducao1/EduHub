package com.project.web_be.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentDTO {
    private Long id;
    private String fileName;
    private String filePath;
    private Long assignmentId;
    private Long submissionId;
    private Long commentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 