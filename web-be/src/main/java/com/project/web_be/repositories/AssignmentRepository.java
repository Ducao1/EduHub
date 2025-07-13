package com.project.web_be.repositories;

import com.project.web_be.entities.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Page<Assignment> findByTeacherId(Long teacherId, Pageable pageable);
    Page<Assignment> findByClassroomId(Long classId, Pageable pageable);
    List<Assignment> findByClassroomId(Long classId);

    @Query("SELECT a FROM Assignment a WHERE a.teacher.id = :teacherId AND LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Assignment> searchByTeacherIdAndTitle(@Param("teacherId") Long teacherId, @Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT a FROM Assignment a WHERE a.classroom.id = :classId AND LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Assignment> searchByClassroomIdAndTitle(@Param("classId") Long classId, @Param("searchTerm") String searchTerm, Pageable pageable);
}
