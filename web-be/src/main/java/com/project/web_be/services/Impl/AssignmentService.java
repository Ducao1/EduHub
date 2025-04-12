package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.AssignmentRepository;
import com.project.web_be.repositories.ClassroomRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.IAssignmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentService implements IAssignmentService {
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassroomRepository classroomRepository;
    @Override
    public Assignment addAssignment(AssignmentDTO assignmentDTO) throws Exception {
        Classroom classroom = classroomRepository.findById(assignmentDTO.getClassId())
                .orElseThrow(() -> new EntityNotFoundException("Class doesn't exist"));
        User teacher = userRepository.findById(assignmentDTO.getTeacherId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher doesn't exist"));

        if (!teacher.getRole().getName().equals("TEACHER")) {
            throw new DataNotFoundException("Role is not teacher");
        }

        LocalDateTime assignedDate = assignmentDTO.getAssignedDate() != null
                ? assignmentDTO.getAssignedDate()
                : LocalDateTime.now();

        LocalDateTime dueDate = assignmentDTO.getDueDate() != null
                ? assignmentDTO.getDueDate()
                : LocalDateTime.of(9999, 12, 31, 23, 59, 59);

        Assignment newAssignment = Assignment.builder()
                .title(assignmentDTO.getTitle())
                .content(assignmentDTO.getContent())
                .teacher(teacher)
                .classroom(classroom)
                .assignedDate(assignedDate)
                .dueDate(dueDate)
                .build();

        return assignmentRepository.save(newAssignment);
    }


    @Override
    public Assignment getAssignmentById(long id) throws Exception {
        Optional<Assignment> optionalAssignment = assignmentRepository.findById(id);
        if (optionalAssignment.isPresent()) {
            Assignment assignment = optionalAssignment.get();

            if (assignment.getDueDate() != null && assignment.getDueDate().getYear() == 9999) {
                assignment.setDueDate(null);
            }
            return assignment;
        }
        throw new DataNotFoundException("Cannot find assignment with id: " + id);
    }


    @Override
    public List<Assignment> getAllAssignmentsByClassId(long classId) {

        return assignmentRepository.findByClassroomId(classId);
    }

    @Override
    @Transactional
    public Assignment updateAssignment(AssignmentDTO assignmentDTO, long id) throws Exception {
        Assignment existingAssignment = getAssignmentById(id);
        if (existingAssignment!=null){
            existingAssignment.setTitle(assignmentDTO.getTitle());
            existingAssignment.setContent(assignmentDTO.getContent());
            existingAssignment.setTeacher(existingAssignment.getTeacher());
        }
        return assignmentRepository.save(existingAssignment);
    }

    @Override
    public List<Assignment> getAllAssignmentsByTeacherId(Long teacherId){
        return assignmentRepository.findByTeacherId(teacherId);
    }

    @Override
    @Transactional
    public void deleteAssignment(long id) {

    }
}
