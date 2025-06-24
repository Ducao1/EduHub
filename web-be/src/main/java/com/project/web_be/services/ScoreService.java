package com.project.web_be.services;

import com.project.web_be.dtos.responses.ScoreAssignmentResponse;
import com.project.web_be.entities.Score;
import com.project.web_be.dtos.ScoreAssignmentResponseDTO;

import java.util.List;

public interface ScoreService {
    Score getScoreBySubmissionId(Long submissionId);
    List<ScoreAssignmentResponse> getScoresByAssignmentId(Long assignmentId);
//    List<Score> getScoresByExamId(Long examId);
//    List<Score> getScoresByUserId(Long userId);
}
