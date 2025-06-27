package com.project.web_be.controllers;

import com.project.web_be.dtos.ExamDTO;
import com.project.web_be.entities.Exam;
import com.project.web_be.dtos.responses.ExamResponse;
import com.project.web_be.services.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/exams")
@RequiredArgsConstructor
public class ExamController {
    private final ExamService examService;

    @PostMapping("add")
    public ResponseEntity<?> addExam(@RequestBody ExamDTO examDTO) {
        try {
            Exam exam = examService.addExam(examDTO);
            return ResponseEntity.ok(ExamResponse.fromExam(exam, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExamById(@PathVariable("id") long id, @RequestParam(required = false) Long classId) {
        try {
            Exam exam = examService.getExamById(id);
            if (classId != null) {
                boolean validClass = exam.getClassExams().stream()
                        .anyMatch(ce -> ce.getClassroom().getId().equals(classId));
                if (!validClass) {
                    return ResponseEntity.badRequest().body("Class ID không hợp lệ cho bài thi");
                }
            }
            return ResponseEntity.ok(ExamResponse.fromExam(exam, classId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/teacher/{id}")
    public ResponseEntity<?> getAllExamsByTeacher(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchTerm) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Exam> exams = examService.getAllExamsByTeacherId(id, pageable, searchTerm);
            Page<ExamResponse> examResponses = exams.map(exam -> ExamResponse.fromExam(exam, null));
            return ResponseEntity.ok(examResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/class/{id}")
    public ResponseEntity<?> getAllExamsByClassId(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String searchTerm) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Exam> exams = examService.getAllExamsByClassId(id, pageable, searchTerm);
            Page<ExamResponse> examResponses = exams.map(exam -> ExamResponse.fromExam(exam, id));
            return ResponseEntity.ok(examResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@RequestBody ExamDTO examDTO, @PathVariable long id) {
        try {
            Exam exam = examService.updateExam(examDTO, id);
            return ResponseEntity.ok(ExamResponse.fromExam(exam, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable long id) {
        try {
            examService.deleteExam(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Delete exam successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}