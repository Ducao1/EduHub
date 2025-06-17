package com.project.web_be.services;

import com.project.web_be.dtos.AssignExamDTO;
import com.project.web_be.dtos.UpdateExamDateDTO;
import com.project.web_be.entities.ClassExam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClassroomExamService {
    ClassExam assignExam(AssignExamDTO assignExamDTO) throws Exception;

    Page<ClassExam> getExamByClassroomId(Long id, Pageable pageable);

    ClassExam updateExamDate(UpdateExamDateDTO updateExamDateDTO, long id) throws Exception;
}
