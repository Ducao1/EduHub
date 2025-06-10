package com.project.web_be.repositories;

import com.project.web_be.entities.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Page<Assignment> findByTeacherId(Long teacherId, Pageable pageable);
    Page<Assignment> findByClassroomId(Long classId, Pageable pageable);
}
