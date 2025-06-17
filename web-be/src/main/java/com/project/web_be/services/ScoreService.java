package com.project.web_be.services;

import com.project.web_be.entities.Score;

import java.util.List;

public interface ScoreService {
    Score getScoreBySubmissionId(Long submissionId);
//    List<Score> getScoresByAssignmentId(Long assignmentId);
//    List<Score> getScoresByExamId(Long examId);
//    List<Score> getScoresByUserId(Long userId);
}
