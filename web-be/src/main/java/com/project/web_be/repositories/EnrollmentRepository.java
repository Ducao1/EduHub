package com.project.web_be.repositories;

import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByClassroomAndStudent(Classroom classroom, User student);

    @Query("SELECT e.classroom FROM Enrollment e WHERE e.student.id = :studentId")
    List<Classroom> findClassesByStudentId(Long studentId);


    @Query("SELECT e.student FROM Enrollment e WHERE e.classroom.id = :classroomId")
    List<User> findStudentsByClassroomId(@Param("classroomId") Long classroomId);

}
