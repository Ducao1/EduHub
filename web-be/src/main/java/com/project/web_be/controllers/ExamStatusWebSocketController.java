package com.project.web_be.controllers;

import com.project.web_be.dtos.enums.ExamStatusType;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.services.IExamStatusService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ExamStatusWebSocketController {
    private final IExamStatusService examStatusService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/exam/status/update")
    @SendTo("/topic/exam/{examId}/status")
    public ExamStatus updateStatus(Long examId, Long studentId, ExamStatusType status) {
        ExamStatus examStatus = examStatusService.updateStatus(examId, studentId, status);
        messagingTemplate.convertAndSend("/topic/exam/" + examId + "/status", examStatus);
        return examStatus;
    }

    @MessageMapping("/exam/status/get")
    @SendTo("/topic/exam/{examId}/status")
    public List<ExamStatus> getExamStatuses(Long examId) {
        return examStatusService.getExamStatuses(examId);
    }
} 