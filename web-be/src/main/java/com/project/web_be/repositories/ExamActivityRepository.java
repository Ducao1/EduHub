package com.project.web_be.repositories;

import com.project.web_be.entities.ExamActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamActivityRepository extends JpaRepository<ExamActivity, Long> {
}