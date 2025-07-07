package com.project.web_be.services;

import com.project.web_be.dtos.SubmissionExamDTO;
import com.project.web_be.entities.Submission;
import com.project.web_be.exceptions.DataNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface SubmissionService {
    Submission submitExam(SubmissionExamDTO submissionExamDTO) throws Exception;
    Submission saveSubmission(Long assignmentId, Long studentId, MultipartFile file) throws IOException, DataNotFoundException;
    boolean hasSubmitted(Long userId, Long assignmentId);
    Submission getSubmissionByStudentAndAssignment(Long userId, Long assignmentId) throws DataNotFoundException;
    List<Map<String, Object>> getClassSubmissionStatus(Long classId, Long assignmentId);
    boolean cancelSubmission(Long userId, Long assignmentId);
}
