package com.project.web_be.repositories;

import com.project.web_be.entities.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    @Query("SELECT e FROM Exam e LEFT JOIN FETCH e.classExams ce LEFT JOIN FETCH ce.classroom LEFT JOIN FETCH e.questions q LEFT JOIN FETCH q.answers WHERE e.id = :id")
    Optional<Exam> findByIdWithDetails(@Param("id") Long id);
    Page<Exam> findByTeacherId(Long teacherId, Pageable pageable);
    @Query("SELECT e FROM Exam e JOIN e.classExams ce WHERE ce.classroom.id = :classId")
    Page<Exam> findByClassroomId(@Param("classId") Long classId, Pageable pageable);
}