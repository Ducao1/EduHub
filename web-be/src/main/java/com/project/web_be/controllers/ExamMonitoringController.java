package com.project.web_be.controllers;

import com.project.web_be.entities.ExamActivity;
import com.project.web_be.services.Impl.ExamMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exam-monitoring")
@RequiredArgsConstructor
public class ExamMonitoringController {
    private final ExamMonitoringService examMonitoringService;

    @PostMapping("/fullscreen-exit")
    public ResponseEntity<Void> handleFullscreenExit(
            @RequestParam Long examId,
            @RequestParam Long studentId,
            @RequestParam String studentName) {
        examMonitoringService.handleFullscreenExit(examId, studentId, studentName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/tab-change")
    public ResponseEntity<Void> handleTabChange(
            @RequestParam Long examId,
            @RequestParam Long studentId,
            @RequestParam String studentName) {
        examMonitoringService.handleTabChange(examId, studentId, studentName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/exam-start")
    public ResponseEntity<Void> handleExamStart(
            @RequestParam Long examId,
            @RequestParam Long studentId,
            @RequestParam String studentName) {
        examMonitoringService.handleExamStart(examId, studentId, studentName);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/exam-submit")
    public ResponseEntity<Void> handleExamSubmit(
            @RequestParam Long examId,
            @RequestParam Long studentId,
            @RequestParam String studentName) {
        examMonitoringService.handleExamSubmit(examId, studentId, studentName);
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/exam.activity")
    public void handleExamActivity(@Payload ExamActivity activity, SimpMessageHeaderAccessor headerAccessor) {
        examMonitoringService.handleWebSocketMessage(activity, headerAccessor);
    }

    @MessageMapping("/exam.join")
    public void handleExamJoin(@Payload ExamActivity activity, SimpMessageHeaderAccessor headerAccessor) {
        examMonitoringService.handleUserJoin(activity, headerAccessor);
    }
} 