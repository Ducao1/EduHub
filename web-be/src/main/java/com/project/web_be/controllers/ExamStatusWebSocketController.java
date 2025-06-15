package com.project.web_be.controllers;

import com.project.web_be.dtos.enums.ExamStatusType;
import com.project.web_be.dtos.requests.ExamClassRequest;
import com.project.web_be.dtos.requests.ExamGetStatusRequest;
import com.project.web_be.dtos.requests.ExamStatusUpdateRequest;
import com.project.web_be.dtos.responses.StudentExamStatusResponse;
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
    public ExamStatus updateStatus(ExamStatusUpdateRequest request) {
        ExamStatus examStatus = examStatusService.updateStatus(request.getExamId(), request.getStudentId(), request.getStatus());
        messagingTemplate.convertAndSend("/topic/exam/" + request.getExamId() + "/status", examStatus);
        return examStatus;
    }

    @MessageMapping("/exam/status/get")
    @SendTo("/topic/exam/{examId}/status")
    public List<ExamStatus> getExamStatuses(ExamGetStatusRequest request) {
        return examStatusService.getExamStatuses(request.getExamId());
    }

    @MessageMapping("/exam/class/students/status")
    @SendTo("/topic/exam/{examId}/class/{classId}/students")
    public List<StudentExamStatusResponse> getClassStudentsWithExamStatus(ExamClassRequest request) {
        return examStatusService.getClassStudentsWithExamStatus(request.getExamId(), request.getClassId());
    }
} 