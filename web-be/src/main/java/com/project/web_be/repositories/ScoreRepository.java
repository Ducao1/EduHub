package com.project.web_be.repositories;

import com.project.web_be.dtos.responses.StudentScoreResponse;
import com.project.web_be.entities.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findBySubmissionId(Long submissionId);
    boolean existsBySubmissionId(Long submissionId);
    List<Score> findAllBySubmission_Assignment_Id(Long assignmentId);
    List<Score> findAllBySubmission_Exam_Id(Long examId);

    @Query("SELECT s.score FROM Score s WHERE s.submission.assignment.id = :assignmentId AND s.submission.student.id = :studentId ORDER BY s.id DESC")
    List<Float> findScoresByAssignmentIdAndStudentId(@Param("assignmentId") Long assignmentId, @Param("studentId") Long studentId);

    @Query("SELECT s.score FROM Score s WHERE s.submission.exam.id = :examId AND s.submission.student.id = :studentId ORDER BY s.id DESC")
    List<Float> findScoresByExamIdAndStudentId(@Param("examId") Long examId, @Param("studentId") Long studentId);
}
