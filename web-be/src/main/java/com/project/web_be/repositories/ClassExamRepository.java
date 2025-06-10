package com.project.web_be.repositories;

import com.project.web_be.entities.ClassExam;
import com.project.web_be.entities.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassExamRepository extends JpaRepository<ClassExam, Long> {
    Page<ClassExam> findByClassroomId(Long id, Pageable pageable);
}
