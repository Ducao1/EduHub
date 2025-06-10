package com.project.web_be.services.Impl;

import com.project.web_be.dtos.enums.ActivityType;
import com.project.web_be.entities.ExamActivity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

import java.time.LocalDateTime;

@Service
public class ExamMonitoringService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void recordActivity(ExamActivity activity) {
        activity.setTimestamp(LocalDateTime.now());
        // Here you would typically save the activity to your database
        
        // Notify instructors in real-time
        String destination = "/topic/exam/" + activity.getExamId() + "/activities";
        messagingTemplate.convertAndSend(destination, activity);
    }

    public void handleFullscreenExit(Long examId, Long studentId, String studentName) {
        ExamActivity activity = new ExamActivity();
        activity.setExamId(examId);
        activity.setStudentId(studentId);
        activity.setStudentName(studentName);
        activity.setActivityType(ActivityType.FULLSCREEN_EXIT);
        activity.setDescription("Student exited fullscreen mode");
        recordActivity(activity);
    }

    public void handleTabChange(Long examId, Long studentId, String studentName) {
        ExamActivity activity = new ExamActivity();
        activity.setExamId(examId);
        activity.setStudentId(studentId);
        activity.setStudentName(studentName);
        activity.setActivityType(ActivityType.TAB_CHANGE);
        activity.setDescription("Student changed browser tab");
        recordActivity(activity);
    }

    public void handleExamStart(Long examId, Long studentId, String studentName) {
        ExamActivity activity = new ExamActivity();
        activity.setExamId(examId);
        activity.setStudentId(studentId);
        activity.setStudentName(studentName);
        activity.setActivityType(ActivityType.EXAM_STARTED);
        activity.setDescription("Student started the exam");
        recordActivity(activity);
    }

    public void handleExamSubmit(Long examId, Long studentId, String studentName) {
        ExamActivity activity = new ExamActivity();
        activity.setExamId(examId);
        activity.setStudentId(studentId);
        activity.setStudentName(studentName);
        activity.setActivityType(ActivityType.EXAM_SUBMITTED);
        activity.setDescription("Student submitted the exam");
        recordActivity(activity);
    }

    // Thêm phương thức xử lý WebSocket message
    public void handleWebSocketMessage(ExamActivity activity, SimpMessageHeaderAccessor headerAccessor) {
        // Xử lý message từ WebSocket
        recordActivity(activity);
    }

    // Thêm phương thức xử lý khi user tham gia
    public void handleUserJoin(ExamActivity activity, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        // Có thể lưu thông tin session ở đây nếu cần
        recordActivity(activity);
    }
} 