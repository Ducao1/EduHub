package com.project.web_be.controllers;

import com.project.web_be.dtos.AttachmentDTO;
import com.project.web_be.services.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/attachments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/submission/{submissionId}")
    public ResponseEntity<AttachmentDTO> uploadAttachmentForSubmission(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long submissionId) {
        AttachmentDTO attachment = attachmentService.createAttachmentForSubmission(file, submissionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
    }

    @PostMapping("/comment/{commentId}")
    public ResponseEntity<AttachmentDTO> uploadAttachmentForComment(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long commentId) {
        AttachmentDTO attachment = attachmentService.createAttachmentForComment(file, commentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
    }

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsBySubmissionId(@PathVariable Long submissionId) {
        List<AttachmentDTO> attachments = attachmentService.getAttachmentsBySubmissionId(submissionId);
        return ResponseEntity.ok(attachments);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByCommentId(@PathVariable Long commentId) {
        List<AttachmentDTO> attachments = attachmentService.getAttachmentsByCommentId(commentId);
        return ResponseEntity.ok(attachments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttachmentDTO> getAttachmentById(@PathVariable Long id) {
        AttachmentDTO attachment = attachmentService.getAttachmentById(id);
        return ResponseEntity.ok(attachment);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        try {
            AttachmentDTO attachment = attachmentService.getAttachmentById(id);
            Path filePath = Paths.get(attachment.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, 
                                "attachment; filename=\"" + attachment.getFileName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<AttachmentDTO>> getAllAttachments() {
        List<AttachmentDTO> attachments = attachmentService.getAllAttachments();
        return ResponseEntity.ok(attachments);
    }
} 