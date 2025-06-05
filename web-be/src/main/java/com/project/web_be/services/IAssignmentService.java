package com.project.web_be.services;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface IAssignmentService {
    Assignment addAssignment(AssignmentDTO assignmentDTO) throws Exception;
    Assignment getAssignmentById(long id) throws Exception;

    List<Assignment> getAllAssignmentsByClassId(long classId);

    Assignment updateAssignment(AssignmentDTO assignmentDTO, long id) throws Exception;

    Page<Assignment> getAllAssignmentsByTeacherId(Long teacherId, Pageable pageable);

    void deleteAssignment(long id);
}
