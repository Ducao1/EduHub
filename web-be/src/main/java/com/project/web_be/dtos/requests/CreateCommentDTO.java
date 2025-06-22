package com.project.web_be.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateCommentDTO {
    private String content;
    private Long classId;
    private Long parentCommentId;
    private List<MultipartFile> files;
} 