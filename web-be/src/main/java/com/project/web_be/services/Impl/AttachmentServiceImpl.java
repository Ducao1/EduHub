package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AttachmentDTO;
import com.project.web_be.entities.Attachment;
import com.project.web_be.entities.Comment;
import com.project.web_be.entities.Submission;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.AttachmentRepository;
import com.project.web_be.repositories.CommentRepository;
import com.project.web_be.repositories.SubmissionRepository;
import com.project.web_be.services.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final SubmissionRepository submissionRepository;
    private final CommentRepository commentRepository;
    
    private static final String UPLOAD_DIR = "uploads/";

    @Override
    public AttachmentDTO createAttachmentForSubmission(MultipartFile file, Long submissionId) {
        try {
            Submission submission = submissionRepository.findById(submissionId)
                    .orElseThrow(() -> new DataNotFoundException("Submission not found with id: " + submissionId));
            
            return saveAttachment(file, submission, null);
        } catch (DataNotFoundException e) {
            throw new RuntimeException("Submission not found: " + e.getMessage());
        }
    }

    @Override
    public AttachmentDTO createAttachmentForComment(MultipartFile file, Long commentId) {
        try {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new DataNotFoundException("Comment not found with id: " + commentId));
            
            return saveAttachment(file, null, comment);
        } catch (DataNotFoundException e) {
            throw new RuntimeException("Comment not found: " + e.getMessage());
        }
    }

    private AttachmentDTO saveAttachment(MultipartFile file, Submission submission, Comment comment) {
        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String fileName = UUID.randomUUID().toString() + fileExtension;

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            Attachment attachment = Attachment.builder()
                    .fileName(fileName)
                    .filePath(UPLOAD_DIR + fileName)
                    .submission(submission)
                    .comment(comment)
                    .build();
            
            Attachment savedAttachment = attachmentRepository.save(attachment);
            return convertToDTO(savedAttachment);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    @Override
    public List<AttachmentDTO> getAttachmentsBySubmissionId(Long submissionId) {
        List<Attachment> attachments = attachmentRepository.findBySubmissionId(submissionId);
        return attachments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttachmentDTO> getAttachmentsByCommentId(Long commentId) {
        List<Attachment> attachments = attachmentRepository.findByCommentId(commentId);
        return attachments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AttachmentDTO getAttachmentById(Long id) {
        try {
            Attachment attachment = attachmentRepository.findById(id)
                    .orElseThrow(() -> new DataNotFoundException("Attachment not found with id: " + id));
            return convertToDTO(attachment);
        } catch (DataNotFoundException e) {
            throw new RuntimeException("Attachment not found: " + e.getMessage());
        }
    }

    @Override
    public void deleteAttachment(Long id) {
        try {
            Attachment attachment = attachmentRepository.findById(id)
                    .orElseThrow(() -> new DataNotFoundException("Attachment not found with id: " + id));
            try {
                Path filePath = Paths.get(attachment.getFilePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete file: " + e.getMessage());
            }
            
            attachmentRepository.delete(attachment);
        } catch (DataNotFoundException e) {
            throw new RuntimeException("Attachment not found: " + e.getMessage());
        }
    }

    @Override
    public List<AttachmentDTO> getAllAttachments() {
        List<Attachment> attachments = attachmentRepository.findAll();
        return attachments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private AttachmentDTO convertToDTO(Attachment attachment) {
        return AttachmentDTO.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .filePath(attachment.getFilePath())
                .submissionId(attachment.getSubmission() != null ? attachment.getSubmission().getId() : null)
                .commentId(attachment.getComment() != null ? attachment.getComment().getId() : null)
                .createdAt(attachment.getCreatedAt())
                .updatedAt(attachment.getUpdatedAt())
                .build();
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
} 