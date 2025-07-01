package com.project.web_be.controllers;

import com.project.web_be.dtos.ExamActivityEventDTO;
import com.project.web_be.dtos.responses.AlertMessage;
import com.project.web_be.entities.ExamActivity;
import com.project.web_be.services.ExamActivityService;
import com.project.web_be.dtos.enums.ActivityType;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import com.project.web_be.repositories.ExamActivityRepository;
import com.project.web_be.dtos.ExamActivityDTO;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class ExamActivityWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ExamActivityService examActivityService;
    private final ExamActivityRepository examActivityRepository;

    @MessageMapping("/exam/activity")
    public void handleExamActivity(@Payload ExamActivityEventDTO dto) {
        if (dto == null || dto.getExamId() == null || dto.getClassId() == null || dto.getStudentId() == null ||
                dto.getActivityType() == null || dto.getTimestamp() == null) {
            throw new IllegalArgumentException("Dữ liệu sự kiện không hợp lệ");
        }
        ExamActivity activity = preProcessActivity(dto);
        ExamActivity savedActivity = examActivityService.saveActivity(activity);
        sendRealTimeNotification(savedActivity);
        checkActivity(savedActivity);
    }

    private ExamActivity preProcessActivity(ExamActivityEventDTO dto) {
        ExamActivity activity = ExamActivity.builder()
                .examId(dto.getExamId())
                .classId(dto.getClassId())
                .studentId(dto.getStudentId())
                .activityType(ActivityType.valueOf(dto.getActivityType()))
                .timestamp(dto.getTimestamp())
                .build();

        LocalDateTime currentTime = LocalDateTime.now();
        if (activity.getTimestamp().isAfter(currentTime.plusMinutes(5))) {
            activity.setTimestamp(currentTime);
        }

        return activity;
    }

    private void sendRealTimeNotification(ExamActivity activity) {
        messagingTemplate.convertAndSend(
                "/topic/exam-activity/" + activity.getExamId() + "/" + activity.getClassId(),
                activity
        );
    }

    private void checkActivity(ExamActivity activity) {
        ActivityType type = ActivityType.valueOf(String.valueOf(activity.getActivityType()));
        switch (type) {
            case FULLSCREEN_EXIT:
            case TAB_CHANGE:
                sendAlert(activity.getExamId(), activity.getClassId(), activity.getStudentId(),
                        "Cảnh báo: Sinh viên " + activity.getStudentId() + " có hành vi đáng ngờ (" + type + ")");
                break;
            case EXAM_LEFT:
                sendAlert(activity.getExamId(), activity.getClassId(), activity.getStudentId(),
                        "Cảnh báo: Sinh viên " + activity.getStudentId() + " đã rời bài thi");
                break;
            default:
                break;
        }
    }

    private void sendAlert(Long examId, Long classId, Long studentId, String message) {
        messagingTemplate.convertAndSend(
                "/topic/exam-alert/" + examId + "/" + classId,
                new AlertMessage(studentId, message)
        );
    }

    @GetMapping("/exam-activity")
    public List<ExamActivityDTO> getExamActivity(
            @RequestParam Long examId,
            @RequestParam Long classId
    ) {
        return examActivityRepository.findByExamIdAndClassIdOrderByTimestampDesc(examId, classId)
                .stream()
                .map(ExamActivityDTO::fromEntity)
                .collect(Collectors.toList());
    }
}