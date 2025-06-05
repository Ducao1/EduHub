package com.project.web_be.controllers;

import com.project.web_be.dtos.ExamEventDTO;
import com.project.web_be.dtos.ExamProgressUpdateDTO;
import com.project.web_be.dtos.enums.ExamEventType;
import com.project.web_be.entities.ExamSession;
import com.project.web_be.services.Impl.ExamSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/exams")
@RequiredArgsConstructor
public class ExamWebSocketController {

    private final ExamSessionService examSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    // Học sinh bắt đầu làm bài
    @MessageMapping("/exam/{examId}/start")
    public void handleExamStart(@DestinationVariable Long examId,
                                @Payload Long studentId) {
        ExamSession session = examSessionService.startExamSession(examId, studentId);

        // Gửi thông tin phiên làm bài cho học sinh
        messagingTemplate.convertAndSendToUser(
                studentId.toString(),
                "/queue/exam/" + examId,
                session
        );

        // Thông báo cho giáo viên
        messagingTemplate.convertAndSend(
                "/topic/exam/" + examId + "/teacher",
                new ExamEventDTO(ExamEventType.STUDENT_JOINED, studentId)
        );
    }

    // Cập nhật tiến độ làm bài
    @MessageMapping("/exam/{examId}/progress")
    public void handleProgressUpdate(@DestinationVariable Long examId,
                                     @Payload ExamProgressUpdateDTO update) {
        examSessionService.updateProgress(
                examId,
                update.getStudentId(),
                update.getAnsweredQuestions()
        );
    }

    // Kết thúc bài thi
    @MessageMapping("/exam/{examId}/end")
    public void handleExamEnd(@DestinationVariable Long examId,
                              @Payload Long studentId) {
        examSessionService.endExamSession(examId, studentId);
    }
}