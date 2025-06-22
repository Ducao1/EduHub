package com.project.web_be.services;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface AssignmentService {
    Assignment addAssignment(AssignmentDTO assignmentDTO, List<MultipartFile> files) throws Exception;
    Assignment getAssignmentById(long id) throws Exception;

    Page<Assignment> getAllAssignmentsByClassId(long classId, Pageable pageable);

    Assignment updateAssignment(AssignmentDTO assignmentDTO, long id) throws Exception;

    Page<Assignment> getAllAssignmentsByTeacherId(Long teacherId, Pageable pageable);

    void deleteAssignment(long id);
}
