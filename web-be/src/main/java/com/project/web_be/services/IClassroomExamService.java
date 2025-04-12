package com.project.web_be.services;

import com.project.web_be.dtos.AssignExamDTO;
import com.project.web_be.dtos.UpdateExamDateDTO;
import com.project.web_be.entities.ClassExam;
import com.project.web_be.responses.AssignedExamResponse;

import java.util.List;

public interface IClassroomExamService {
    ClassExam assignExam(AssignExamDTO assignExamDTO) throws Exception;

    List<ClassExam> getExamByClassroomId(Long id);

    ClassExam updateExamDate(UpdateExamDateDTO updateExamDateDTO, long id) throws Exception;
}
