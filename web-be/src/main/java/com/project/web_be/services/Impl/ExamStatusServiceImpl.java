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
import com.project.web_be.services.IExamStatusService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamStatusServiceImpl implements IExamStatusService {
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
        if (status == ExamStatusType.IN_PROGRESS) {
            examStatus.setStartTime(System.currentTimeMillis());
        } else if (status == ExamStatusType.SUBMITTED) {
            examStatus.setSubmitTime(System.currentTimeMillis());
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
        // Kiểm tra bài thi tồn tại
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> {
                    logger.error("Exam not found with ID: {}", examId);
                    return new RuntimeException("Không tìm thấy bài thi");
                });
        logger.info("Found exam: {}", exam.getTitle());

        // Lấy danh sách sinh viên trong lớp
        List<User> students = enrollmentRepository.findStudentsByClassroomId(classId);
        logger.info("Found {} students in classId: {}", students.size(), classId);

        if (students.isEmpty()) {
            logger.warn("No students found in classId: {}", classId);
            throw new RuntimeException("Không tìm thấy sinh viên nào trong lớp");
        }

        // Lấy trạng thái bài thi của từng sinh viên và chuyển đổi sang DTO
        List<StudentExamStatusResponse> responses = students.stream()
                .map(student -> {
                    ExamStatus status = examStatusRepository.findByExamAndStudent(exam, student)
                            .orElse(ExamStatus.builder()
                                    .exam(exam)
                                    .student(student)
                                    .status(ExamStatusType.NOT_STARTED)
                                    .build());
                    StudentExamStatusResponse response = StudentExamStatusResponse.fromUserAndExamStatus(student, status);
                    logger.debug("Mapped student {} to status: {}", student.getFullName(), response.getStatus());
                    return response;
                })
                .collect(Collectors.toList());

        logger.info("Returning {} student exam status responses.", responses.size());
        return responses;
    }
} 