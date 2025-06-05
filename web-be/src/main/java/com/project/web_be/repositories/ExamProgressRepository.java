package com.project.web_be.repositories;

import com.project.web_be.entities.ExamProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExamProgressRepository extends JpaRepository<ExamProgress, Long> {
    Optional<ExamProgress> findByExamSessionId(Long examSessionId);
}