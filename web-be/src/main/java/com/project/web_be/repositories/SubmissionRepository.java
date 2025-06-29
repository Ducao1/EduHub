package com.project.web_be.repositories;

import com.project.web_be.entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    boolean existsByStudentIdAndAssignmentId(Long userId, Long assignmentId);

    Optional<Submission> findByStudentIdAndAssignmentId(Long userId, Long assignmentId);

    List<Submission> findByExamIdAndStudentId(Long examId, Long studentId);

    List<Submission> findByExamId(Long examId);

    void deleteByStudentIdAndAssignmentId(Long userId, Long assignmentId);
    
    @Query("SELECT s FROM Submission s LEFT JOIN FETCH s.score WHERE s.exam.id = :examId AND s.student.id = :studentId")
    List<Submission> findByExamIdAndStudentIdWithScore(@Param("examId") Long examId, @Param("studentId") Long studentId);
    
    @Query("SELECT s FROM Submission s LEFT JOIN FETCH s.score WHERE s.student.id = :studentId AND s.assignment.id = :assignmentId")
    Optional<Submission> findByStudentIdAndAssignmentIdWithScore(@Param("studentId") Long studentId, @Param("assignmentId") Long assignmentId);
}
