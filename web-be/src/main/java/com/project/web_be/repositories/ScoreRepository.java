package com.project.web_be.repositories;

import com.project.web_be.dtos.responses.StudentScoreResponse;
import com.project.web_be.entities.Score;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findBySubmissionId(Long submissionId);
    boolean existsBySubmissionId(Long submissionId);
    List<Score> findAllBySubmission_Assignment_Id(Long assignmentId);
    List<Score> findAllBySubmission_Exam_Id(Long examId);


}
