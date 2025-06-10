package com.project.web_be.repositories;

import com.project.web_be.entities.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    Page<Exam> findByTeacherId(long teacherId, Pageable pageable);
    
    @Query("SELECT e FROM Exam e JOIN e.classExams ce WHERE ce.classroom.id = :classId")
    Page<Exam> findByClassroomId(@Param("classId") Long classId, Pageable pageable);
}
