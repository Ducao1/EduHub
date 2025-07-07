package com.project.web_be.services;

import com.project.web_be.dtos.AttachmentDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    AttachmentDTO createAttachmentForSubmission(MultipartFile file, Long submissionId);
    AttachmentDTO createAttachmentForComment(MultipartFile file, Long commentId);
    List<AttachmentDTO> getAttachmentsBySubmissionId(Long submissionId);
    List<AttachmentDTO> getAttachmentsByCommentId(Long commentId);
    AttachmentDTO getAttachmentById(Long id);
    void deleteAttachment(Long id);
    List<AttachmentDTO> getAllAttachments();
} 