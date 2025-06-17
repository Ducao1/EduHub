//package com.project.web_be.repositories;
//
//import com.project.web_be.entities.Exam;
//import com.project.web_be.entities.ExamStatus;
//import com.project.web_be.entities.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface ExamStatusRepository extends JpaRepository<ExamStatus, Long> {
//    Optional<ExamStatus> findByExamAndStudent(Exam exam, User student);
//    List<ExamStatus> findByExam(Exam exam);
//}
package com.project.web_be.repositories;

import com.project.web_be.entities.Exam;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ExamStatusRepository extends JpaRepository<ExamStatus, Long> {
    @Query("SELECT es FROM ExamStatus es JOIN FETCH es.exam JOIN FETCH es.student WHERE es.exam = :exam AND es.student = :student")
    Optional<ExamStatus> findByExamAndStudent(@Param("exam") Exam exam, @Param("student") User student);

    @Query("SELECT es FROM ExamStatus es JOIN FETCH es.exam JOIN FETCH es.student WHERE es.exam = :exam")
    List<ExamStatus> findByExam(@Param("exam") Exam exam);
}