package com.project.web_be.controllers;

import com.project.web_be.dtos.SubmissionExamDTO;
import com.project.web_be.entities.Submission;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.responses.AssignedExamResponse;
import com.project.web_be.responses.ListSubmissionResponse;
import com.project.web_be.responses.SubmitExamResponse;
import com.project.web_be.services.Impl.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

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
        return ResponseEntity.ok(Map.of(
                "message", "File uploaded successfully",
                "filePath", submission.getFilePath()
        ));
    }

    @GetMapping("/status/{userId}/{assignmentId}")
    public ResponseEntity<Map<String, Boolean>> getSubmissionStatus(@PathVariable Long userId, @PathVariable Long assignmentId) {
        boolean hasSubmitted = submissionService.hasSubmitted(userId, assignmentId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("submitted", hasSubmitted);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/class/{classId}/assignment/{assignmentId}")
    public ResponseEntity<List<Map<String, Object>>> getClassSubmissionStatus(
            @PathVariable Long classId, @PathVariable Long assignmentId) {

        List<Map<String, Object>> response = submissionService.getClassSubmissionStatus(classId, assignmentId);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/cancel/{userId}/{assignmentId}")
    public ResponseEntity<String> cancelSubmission(@PathVariable Long userId, @PathVariable Long assignmentId) {
        boolean deleted = submissionService.cancelSubmission(userId, assignmentId);
        if (deleted) {
            return ResponseEntity.ok("Hủy nộp bài thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bài nộp!");
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
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
