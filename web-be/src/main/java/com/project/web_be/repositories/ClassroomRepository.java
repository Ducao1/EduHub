package com.project.web_be.repositories;

import com.project.web_be.entities.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    List<Classroom> findByTeacherId(Long teacherId);

    boolean existsByCode(String code);

    Optional<Classroom> findByCode(String code);
}
