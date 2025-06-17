package com.project.web_be.services.Impl;

import com.project.web_be.dtos.enums.ExamStatusType;
import com.project.web_be.dtos.responses.StudentExamStatusResponse;
import com.project.web_be.entities.Exam;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.entities.User;
import com.project.web_be.repositories.EnrollmentRepository;
import com.project.web_be.repositories.ExamRepository;
import com.project.web_be.repositories.ExamStatusRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.ExamStatusService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamStatusServiceImpl implements ExamStatusService {
    private static final Logger logger = LoggerFactory.getLogger(ExamStatusServiceImpl.class);
    private final ExamStatusRepository examStatusRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public ExamStatus updateStatus(Long examId, Long studentId, ExamStatusType status) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ExamStatus examStatus = examStatusRepository.findByExamAndStudent(exam, student)
                .orElse(ExamStatus.builder()
                        .exam(exam)
                        .student(student)
                        .status(ExamStatusType.NOT_STARTED)
                        .build());

        examStatus.setStatus(status);
        if (status == ExamStatusType.PENDING || status == ExamStatusType.IN_PROGRESS) {
            if (examStatus.getStartTime() == null) {
                examStatus.setStartTime(LocalDateTime.now());
            }
        } else if (status == ExamStatusType.SUBMITTED) {
            examStatus.setSubmitTime(LocalDateTime.now());
        }

        return examStatusRepository.save(examStatus);
    }

    @Override
    public List<ExamStatus> getExamStatuses(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return examStatusRepository.findByExam(exam);
    }

    @Override
    public ExamStatus getStudentExamStatus(Long examId, Long studentId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return examStatusRepository.findByExamAndStudent(exam, student)
                .orElse(ExamStatus.builder()
                        .exam(exam)
                        .student(student)
                        .status(ExamStatusType.NOT_STARTED)
                        .build());
    }

    @Override
    public List<StudentExamStatusResponse> getClassStudentsWithExamStatus(Long examId, Long classId) {
        logger.info("Received request for examId: {} and classId: {}", examId, classId);
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> {
                    logger.error("Exam not found with ID: {}", examId);
                    return new RuntimeException("Không tìm thấy bài thi");
                });
        logger.info("Found exam: {}", exam.getTitle());

        List<User> students = enrollmentRepository.findStudentsByClassroomId(classId);
        logger.info("Found {} students in classId: {}", students.size(), classId);

        if (students.isEmpty()) {
            logger.warn("No students found in classId: {}", classId);
            throw new RuntimeException("Không tìm thấy sinh viên nào trong lớp");
        }

        List<StudentExamStatusResponse> responses = students.stream()
                .map(student -> {
                    ExamStatus status = examStatusRepository.findByExamAndStudent(exam, student)
                            .orElse(ExamStatus.builder()
                                    .exam(exam)
                                    .student(student)
                                    .status(ExamStatusType.NOT_STARTED)
                                    .build());
                    return StudentExamStatusResponse.fromUserAndExamStatus(student, status);
                })
                .collect(Collectors.toList());

        logger.info("Returning {} student exam status responses for examId={} classId={}", responses.size(), examId, classId);
        return responses;
    }
}