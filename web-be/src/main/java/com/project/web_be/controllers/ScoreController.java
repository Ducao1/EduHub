package com.project.web_be.controllers;

import com.project.web_be.entities.Score;
import com.project.web_be.services.Impl.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/scores")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreService scoreService;

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
}
