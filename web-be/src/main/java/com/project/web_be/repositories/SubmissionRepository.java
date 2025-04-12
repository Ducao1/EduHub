package com.project.web_be.repositories;

import com.project.web_be.entities.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    boolean existsByStudentIdAndAssignmentId(Long userId, Long assignmentId);

    Optional<Submission> findByStudentIdAndAssignmentId(Long userId, Long assignmentId);

    List<Submission> findByExamIdAndStudentId(Long examId, Long studentId);

    List<Submission> findByExamId(Long examId);
}
