package com.project.web_be.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String content;
    private Long classId;
    private Long parentCommentId;
    private Integer likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDTO> subComments;
    private List<AttachmentDTO> attachments;
} 