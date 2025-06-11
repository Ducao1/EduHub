package com.project.web_be.services.Impl;

import com.project.web_be.dtos.enums.ExamStatusType;
import com.project.web_be.entities.Exam;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.entities.User;
import com.project.web_be.repositories.ExamRepository;
import com.project.web_be.repositories.ExamStatusRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.IExamStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamStatusServiceImpl implements IExamStatusService {
    private final ExamStatusRepository examStatusRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;

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
} 