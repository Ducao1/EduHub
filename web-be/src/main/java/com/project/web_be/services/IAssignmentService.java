package com.project.web_be.services;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;

import java.util.List;


public interface IAssignmentService {
    Assignment addAssignment(AssignmentDTO assignmentDTO) throws Exception;
    Assignment getAssignmentById(long id) throws Exception;

    List<Assignment> getAllAssignmentsByClassId(long classId);

    Assignment updateAssignment(AssignmentDTO assignmentDTO, long id) throws Exception;

    List<Assignment> getAllAssignmentsByTeacherId(Long teacherId);

    void deleteAssignment(long id);
}
