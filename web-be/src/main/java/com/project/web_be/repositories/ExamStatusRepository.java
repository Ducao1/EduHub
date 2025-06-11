package com.project.web_be.repositories;

import com.project.web_be.entities.Exam;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamStatusRepository extends JpaRepository<ExamStatus, Long> {
    Optional<ExamStatus> findByExamAndStudent(Exam exam, User student);
    List<ExamStatus> findByExam(Exam exam);
} 