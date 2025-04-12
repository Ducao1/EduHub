package com.project.web_be.services;

import com.project.web_be.dtos.ExamDTO;
import com.project.web_be.entities.Exam;

import java.util.List;

public interface IExamService {
    Exam addExam(ExamDTO examDTO) throws Exception;
    Exam getExamById(long id) throws Exception;
    List<Exam> getAllExams();

    List<Exam> getAllExamsByTeacherId(long teacherId);

    Exam updateExam(ExamDTO examDTO, long id) throws Exception;
    void deleteExam(long id);
}
