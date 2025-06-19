package com.project.web_be.controllers;

import com.project.web_be.dtos.requests.ExamClassRequest;
import com.project.web_be.dtos.requests.ExamGetStatusRequest;
import com.project.web_be.dtos.requests.ExamStatusUpdateRequest;
import com.project.web_be.dtos.responses.StudentExamStatusResponse;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.services.ExamStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

//@RestController
@Controller
@RequiredArgsConstructor
public class ExamStatusWebSocketController {
    private final ExamStatusService examStatusService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/exam/status/update")
    public void updateStatus(ExamStatusUpdateRequest request) {
        if (request.getClassId() == null) {
            throw new IllegalArgumentException("Class ID is required");
        }
        ExamStatus examStatus = examStatusService.updateStatus(request.getExamId(), request.getStudentId(), request.getStatus());
        messagingTemplate.convertAndSend("/topic/exam/" + request.getExamId() + "/status", examStatus);
        List<StudentExamStatusResponse> studentStatuses = examStatusService.getClassStudentsWithExamStatus(
                request.getExamId(), request.getClassId());
        messagingTemplate.convertAndSend(
                "/topic/exam/" + request.getExamId() + "/class/" + request.getClassId() + "/students",
                studentStatuses
        );
    }

    @MessageMapping("/exam/status/get")
    public void getExamStatuses(ExamGetStatusRequest request) {
        List<ExamStatus> statuses = examStatusService.getExamStatuses(request.getExamId());
        messagingTemplate.convertAndSend("/topic/exam/" + request.getExamId() + "/status", statuses);
    }

    @MessageMapping("/exam/class/students/status")
    public void getClassStudentsWithExamStatus(ExamClassRequest request) {
        List<StudentExamStatusResponse> studentStatuses = examStatusService.getClassStudentsWithExamStatus(
                request.getExamId(), request.getClassId());
        messagingTemplate.convertAndSend(
                "/topic/exam/" + request.getExamId() + "/class/" + request.getClassId() + "/students",
                studentStatuses
        );
    }
}