package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AssignExamDTO;
import com.project.web_be.dtos.UpdateExamDateDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.ClassExam;
import com.project.web_be.entities.Exam;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.ClassExamRepository;
import com.project.web_be.repositories.ClassroomRepository;
import com.project.web_be.repositories.ExamRepository;
import com.project.web_be.services.ClassroomExamService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomExamServiceImpl implements ClassroomExamService {
    private final ClassExamRepository classExamRepository;
    private final ClassroomRepository classroomRepository;
    private final ExamRepository examRepository;
    @Override
    public ClassExam assignExam(AssignExamDTO assignExamDTO) throws Exception {
        Classroom classroom = classroomRepository.findById(assignExamDTO.getClassId())
                .orElseThrow(() -> new DataNotFoundException("Classroom not found"));
        Exam exam = examRepository.findById(assignExamDTO.getExamId())
                .orElseThrow(() -> new DataNotFoundException("Exam not found"));
        if (assignExamDTO.getDueDate()!=null &&
                assignExamDTO.getAssignedDate()!=null &&
                assignExamDTO.getDueDate().isBefore(assignExamDTO.getAssignedDate())){
            throw new IllegalArgumentException("Due date cannot be before assigned date");
        }
        ClassExam newClassExam = ClassExam.builder()
                .exam(exam)
                .classroom(classroom)
                .dueDate(assignExamDTO.getDueDate())
                .assignedDate(assignExamDTO.getAssignedDate()).build();

        return classExamRepository.save(newClassExam);
    }

    @Override
    public Page<ClassExam> getExamByClassroomId(Long id, Pageable pageable){
        return classExamRepository.findByClassroomId(id, pageable);
    }

    @Override
    @Transactional
    public ClassExam updateExamDate(UpdateExamDateDTO updateExamDateDTO, long id) throws Exception {
        ClassExam existingClassExam = classExamRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("ClassroomExam not found"));
        if (updateExamDateDTO.getDueDate()!=null &&
                updateExamDateDTO.getAssignedDate()!=null &&
                updateExamDateDTO.getDueDate().isBefore(updateExamDateDTO.getAssignedDate())){
            throw new IllegalArgumentException("Due date cannot be before assigned date");
        }
        existingClassExam.setDueDate(updateExamDateDTO.getDueDate());
        existingClassExam.setAssignedDate(updateExamDateDTO.getAssignedDate());

        return classExamRepository.save(existingClassExam);
    }
}
