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

import java.time.LocalDateTime;
import java.time.ZoneId;

@Controller
@RequiredArgsConstructor
public class ExamActivityWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ExamActivityService examActivityService;

    @MessageMapping("/exam/activity")
    public void handleExamActivity(@Payload ExamActivityEventDTO dto) {
        // 1. Kiểm tra tính hợp lệ của dữ liệu
        if (dto == null || dto.getExamId() == null || dto.getClassId() == null || dto.getStudentId() == null ||
                dto.getActivityType() == null || dto.getTimestamp() == null) {
            throw new IllegalArgumentException("Dữ liệu sự kiện không hợp lệ");
        }

        // 2. Xử lý logic trước khi lưu
        ExamActivity activity = preProcessActivity(dto);

        // 3. Lưu hoạt động vào cơ sở dữ liệu
        ExamActivity savedActivity = examActivityService.saveActivity(activity);

        // 4. Gửi thông báo realtime đến giáo viên
        sendRealTimeNotification(savedActivity);

        // 5. Kiểm tra và gửi cảnh báo nếu có hành vi đáng ngờ
        checkActivity(savedActivity);
    }

    private ExamActivity preProcessActivity(ExamActivityEventDTO dto) {
        ExamActivity activity = ExamActivity.builder()
                .examId(dto.getExamId())
                .classId(dto.getClassId())
                .studentId(dto.getStudentId())
                .activityType(dto.getActivityType())
                .timestamp(dto.getTimestamp())
                .build();

        // Thêm xử lý bổ sung (ví dụ: kiểm tra timestamp hợp lệ)
        LocalDateTime currentTime = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")); // Múi giờ +07
        if (activity.getTimestamp().isAfter(currentTime.plusMinutes(5))) { // Kiểm tra thời gian trong tương lai quá 5 phút
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
        ActivityType type = ActivityType.valueOf(activity.getActivityType());
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
}