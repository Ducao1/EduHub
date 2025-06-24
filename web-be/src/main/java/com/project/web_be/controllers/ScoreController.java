package com.project.web_be.controllers;

import com.project.web_be.entities.Score;
import com.project.web_be.services.Impl.ScoreServiceImpl;
import com.project.web_be.services.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.web_be.dtos.ScoreDTO;
import com.project.web_be.dtos.ScoreAssignmentResponseDTO;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/scores")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreServiceImpl scoreService;

    @PostMapping("/auto-grade/{submissionId}")
    public ResponseEntity<?> autoGrade(@PathVariable Long submissionId) {
        try {
            Score score = scoreService.autoGradeSubmission(submissionId);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/manual-grade")
    public ResponseEntity<?> manualGrade(@RequestParam Long submissionId,
                                         @RequestParam Long teacherId,
                                         @RequestParam float totalScore) {
        try {
            Score score = scoreService.manualGradeSubmission(submissionId, teacherId, totalScore);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/grade")
    public ResponseEntity<?> gradeSubmission(@RequestBody ScoreDTO scoreDTO) {
        try {
            Score score = scoreService.gradeSubmission(scoreDTO);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<?> getScoresBySubmissionId(@PathVariable long id){
        try {
            return ResponseEntity.ok(scoreService.getScoreBySubmissionId(id));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<?> getScoresByAssignmentId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(scoreService.getScoresByAssignmentId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

//    @GetMapping("/exams/{id}")
//    public ResponseEntity<?> getScoresByExamId(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok(scoreService.getScoresByExamId(id));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//
//    @GetMapping("/users/{id}")
//    public ResponseEntity<?> getScoresByUserId(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok(scoreService.getScoresByUserId(id));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
}
