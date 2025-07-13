package com.project.web_be.services;

import com.project.web_be.dtos.responses.ScoreAssignmentResponse;
import com.project.web_be.dtos.responses.StudentScoreResponse;
import com.project.web_be.entities.Score;
import com.project.web_be.dtos.ListStudentScoreDTO;
import com.project.web_be.dtos.ScoreAssignmentResponseDTO;
import com.project.web_be.dtos.ScoreDTO;

import java.util.List;

public interface ScoreService {
    Score getScoreBySubmissionId(Long submissionId);
    List<ScoreAssignmentResponse> getScoresByAssignmentId(Long assignmentId);
    List<ScoreDTO> getScoresByExamId(Long examId);
    List<StudentScoreResponse> getExamScoresByStudentId(Long studentId);
    List<StudentScoreResponse> getAssignmentScoresByStudentId(Long studentId);
    List<ListStudentScoreDTO> getStudentScoresByClassId(Long classId);
}
