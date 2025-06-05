package com.project.web_be.repositories;

import com.project.web_be.entities.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    List<ExamSession> findByExamIdAndIsActiveTrue(Long examId);
    Optional<ExamSession> findByExamIdAndStudentIdAndIsActiveTrue(Long examId, Long studentId);
}