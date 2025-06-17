package com.project.web_be.services;

import com.project.web_be.dtos.ExamDTO;
import com.project.web_be.entities.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ExamService {
    Exam addExam(ExamDTO examDTO) throws Exception;
    Exam getExamById(long id) throws Exception;
    List<Exam> getAllExams();

    Page<Exam> getAllExamsByTeacherId(long teacherId, Pageable pageable);

    Page<Exam> getAllExamsByClassId(Long classId, Pageable pageable);

    Exam updateExam(ExamDTO examDTO, long id) throws Exception;
    void deleteExam(long id);
}
