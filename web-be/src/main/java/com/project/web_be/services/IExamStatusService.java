package com.project.web_be.services;

import com.project.web_be.dtos.enums.ExamStatusType;
import com.project.web_be.dtos.responses.StudentExamStatusResponse;
import com.project.web_be.entities.ExamStatus;
import java.util.List;

public interface IExamStatusService {
    ExamStatus updateStatus(Long examId, Long studentId, ExamStatusType status);
    List<ExamStatus> getExamStatuses(Long examId);
    ExamStatus getStudentExamStatus(Long examId, Long studentId);
    List<StudentExamStatusResponse> getClassStudentsWithExamStatus(Long examId, Long classId);
} 