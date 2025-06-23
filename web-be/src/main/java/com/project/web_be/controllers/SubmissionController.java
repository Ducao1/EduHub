package com.project.web_be.controllers;

import com.project.web_be.dtos.AttachmentDTO;
import com.project.web_be.dtos.SubmissionExamDTO;
import com.project.web_be.entities.Attachment;
import com.project.web_be.entities.Submission;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.dtos.responses.ListSubmissionResponse;
import com.project.web_be.dtos.responses.SubmitExamResponse;
import com.project.web_be.services.Impl.SubmissionServiceImpl;
import com.project.web_be.services.SubmissionService;
import com.project.web_be.services.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionServiceImpl submissionService;
    private final AttachmentService attachmentService;

    @PostMapping(value = "/assignment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitAssignment(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("studentId") Long studentId,
            @RequestParam("file") MultipartFile file) throws IOException, DataNotFoundException {

        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "File không được để trống!"));
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(Map.of("message", "File " + file.getOriginalFilename() + " vượt quá dung lượng cho phép (5MB)!"));
        }

        Submission submission = submissionService.saveSubmission(assignmentId, studentId, file);
        
        // Lấy attachments của submission
        List<AttachmentDTO> attachments = attachmentService.getAttachmentsBySubmissionId(submission.getId());
        
        return ResponseEntity.ok(Map.of(
                "message", "File uploaded successfully",
                "submissionId", submission.getId(),
                "attachments", attachments
        ));
    }

    @GetMapping("/status/{userId}/{assignmentId}")
    public ResponseEntity<?> getSubmissionStatus(@PathVariable Long userId, @PathVariable Long assignmentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Submission submission = submissionService.getSubmissionByStudentAndAssignment(userId, assignmentId);
            
            Map<String, Object> submissionDetails = new HashMap<>();
            submissionDetails.put("id", submission.getId());
            if (submission.getAttachments() != null && !submission.getAttachments().isEmpty()) {
                String downloadName = submission.getAttachments().get(0).getFilePath().split("/")[1];
                submissionDetails.put("file", downloadName);
            }
            submissionDetails.put("submissionDate", submission.getCreatedAt());

            response.put("hasSubmitted", true);
            response.put("submission", submissionDetails);
            return ResponseEntity.ok(response);
        } catch (DataNotFoundException e) {
            response.put("hasSubmitted", false);
            response.put("submission", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getSubmissionFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/status/class/{classId}/assignment/{assignmentId}")
    public ResponseEntity<List<Map<String, Object>>> getClassSubmissionStatus(
            @PathVariable Long classId, @PathVariable Long assignmentId) {

        List<Map<String, Object>> response = submissionService.getClassSubmissionStatus(classId, assignmentId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cancel/{userId}/{assignmentId}")
    public ResponseEntity<?> cancelSubmission(@PathVariable Long userId, @PathVariable Long assignmentId) {
        boolean deleted = submissionService.cancelSubmission(userId, assignmentId);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Hủy nộp bài thành công!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Không tìm thấy bài nộp!"));
        }
    }

    @PostMapping("/submit-exam")
    public ResponseEntity<?> submitExam(@RequestBody SubmissionExamDTO submissionExamDTO) {
        try {
            Submission submission = submissionService.submitExam(submissionExamDTO);
            return ResponseEntity.ok(SubmitExamResponse.fromSubmission(submission));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<?> getStudentSubmissions(
            @PathVariable Long studentId,
            @PathVariable Long examId) {
        try {
            List<Submission> submissions = submissionService.getStudentSubmissions(examId, studentId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getAllSubmissionByExamId(@PathVariable Long examId) {
        try {
            List<Submission> submissions = submissionService.getExamSubmissions(examId);
            List<ListSubmissionResponse> listSubmissionResponses = submissions.stream()
                    .map(ListSubmissionResponse::fromSubmission)
                    .toList();
            return ResponseEntity.ok(listSubmissionResponses);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        try {
            Submission submission = submissionService.getSubmissionById(id);
            // Lấy attachments của submission
            List<AttachmentDTO> attachments = attachmentService.getAttachmentsBySubmissionId(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("submission", submission);
            response.put("attachments", attachments);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Attachment endpoints
    @PostMapping("/{submissionId}/attachments")
    public ResponseEntity<?> addAttachmentToSubmission(
            @PathVariable Long submissionId,
            @RequestParam("file") MultipartFile file) {
        try {
            AttachmentDTO attachment = attachmentService.createAttachmentForSubmission(file, submissionId);
            return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{submissionId}/attachments")
    public ResponseEntity<?> getSubmissionAttachments(@PathVariable Long submissionId) {
        try {
            List<AttachmentDTO> attachments = attachmentService.getAttachmentsBySubmissionId(submissionId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long attachmentId) {
        try {
            attachmentService.deleteAttachment(attachmentId);
            return ResponseEntity.ok(Map.of("message", "Attachment deleted successfully"));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
