package com.project.web_be.services.Impl;

import com.project.web_be.dtos.ExamEventDTO;
import com.project.web_be.dtos.enums.ExamEventType;
import com.project.web_be.entities.Exam;
import com.project.web_be.entities.ExamProgress;
import com.project.web_be.entities.ExamSession;
import com.project.web_be.repositories.ExamProgressRepository;
import com.project.web_be.repositories.ExamRepository;
import com.project.web_be.repositories.ExamSessionRepository;
import com.project.web_be.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamSessionService {
    private final ExamSessionRepository examSessionRepository;
    private final ExamProgressRepository examProgressRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Khởi tạo phiên làm bài
    public ExamSession startExamSession(Long examId, Long studentId) {
        Exam exam = examRepository.findById(examId).orElseThrow();
        ExamSession session = ExamSession.builder()
                .exam(examRepository.findById(examId).orElseThrow())
                .student(userRepository.findById(studentId).orElseThrow())
                .startTime(LocalDateTime.now())
                .isActive(true)
                .build();

        ExamSession savedSession = examSessionRepository.save(session);

        // Tạo progress ban đầu
        ExamProgress progress = ExamProgress.builder()
                .examSession(savedSession)
                .answeredQuestions(0)
                .totalQuestions(exam.getQuestions().size())
                .lastActivity(LocalDateTime.now())
                .isActive(true)
                .build();

        examProgressRepository.save(progress);

        // Thông báo cho giáo viên
        notifyTeacherExamStarted(examId, studentId);

        return savedSession;
    }

    // Cập nhật tiến độ làm bài
    public void updateProgress(Long examId, Long studentId, int answeredQuestions) {
        ExamSession session = examSessionRepository
                .findByExamIdAndStudentIdAndIsActiveTrue(examId, studentId)
                .orElseThrow();

        ExamProgress progress = examProgressRepository
                .findByExamSessionId(session.getId())
                .orElseThrow();

        progress.setAnsweredQuestions(answeredQuestions);
        progress.setLastActivity(LocalDateTime.now());
        examProgressRepository.save(progress);

        // Gửi cập nhật cho giáo viên
        sendProgressUpdate(examId, studentId, progress);
    }

    // Kết thúc phiên làm bài
    public void endExamSession(Long examId, Long studentId) {
        ExamSession session = examSessionRepository
                .findByExamIdAndStudentIdAndIsActiveTrue(examId, studentId)
                .orElseThrow();

        session.setActive(false);
        session.setEndTime(LocalDateTime.now());
        examSessionRepository.save(session);

        // Cập nhật progress
        ExamProgress progress = examProgressRepository
                .findByExamSessionId(session.getId())
                .orElseThrow();
        progress.setActive(false);
        examProgressRepository.save(progress);

        // Thông báo cho giáo viên
        notifyTeacherExamEnded(examId, studentId);
    }

    // Thêm các phương thức thông báo vào cuối class ExamSessionService

    // Thông báo cho giáo viên khi học sinh bắt đầu làm bài
    private void notifyTeacherExamStarted(Long examId, Long studentId) {
        ExamEventDTO event = ExamEventDTO.builder()
                .type(ExamEventType.STUDENT_JOINED)
                .studentId(studentId)
                .data(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", "STARTED"
                ))
                .build();

        messagingTemplate.convertAndSend(
                "/topic/exam/" + examId + "/teacher",
                event
        );
    }

    // Thông báo cho giáo viên khi học sinh kết thúc bài thi
    private void notifyTeacherExamEnded(Long examId, Long studentId) {
        ExamEventDTO event = ExamEventDTO.builder()
                .type(ExamEventType.EXAM_ENDED)
                .studentId(studentId)
                .data(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", "ENDED"
                ))
                .build();

        messagingTemplate.convertAndSend(
                "/topic/exam/" + examId + "/teacher",
                event
        );
    }

    // Gửi cập nhật tiến độ cho giáo viên
    private void sendProgressUpdate(Long examId, Long studentId, ExamProgress progress) {
        ExamEventDTO event = ExamEventDTO.builder()
                .type(ExamEventType.PROGRESS_UPDATED)
                .studentId(studentId)
                .data(Map.of(
                        "answeredQuestions", progress.getAnsweredQuestions(),
                        "totalQuestions", progress.getTotalQuestions(),
                        "lastActivity", progress.getLastActivity()
                ))
                .build();

        messagingTemplate.convertAndSend(
                "/topic/exam/" + examId + "/teacher",
                event
        );
    }

    // Thông báo cho giáo viên khi học sinh rời khỏi bài thi
    private void notifyTeacherStudentLeft(Long examId, Long studentId) {
        ExamEventDTO event = ExamEventDTO.builder()
                .type(ExamEventType.STUDENT_LEFT)
                .studentId(studentId)
                .data(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", "LEFT"
                ))
                .build();

        messagingTemplate.convertAndSend(
                "/topic/exam/" + examId + "/teacher",
                event
        );
    }
}