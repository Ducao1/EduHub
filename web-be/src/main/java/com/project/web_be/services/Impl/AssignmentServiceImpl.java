package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.AssignmentRepository;
import com.project.web_be.repositories.ClassroomRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.AssignmentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.project.web_be.entities.Attachment;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class AssignmentServiceImpl implements AssignmentService {
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassroomRepository classroomRepository;
    private final Path fileStorageLocation;

    public AssignmentServiceImpl(UserRepository userRepository, AssignmentRepository assignmentRepository, ClassroomRepository classroomRepository) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.classroomRepository = classroomRepository;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    @Transactional
    public Assignment addAssignment(AssignmentDTO assignmentDTO, List<MultipartFile> files) throws Exception {
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
                .attachments(new ArrayList<>())
                .build();

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file.isEmpty()){
                    continue;
                }
                String storedFileName = storeFile(file);
                Attachment attachment = Attachment.builder()
                        .fileName(StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename())))
                        .filePath("uploads/" + storedFileName)
                        .assignment(newAssignment)
                        .build();
                newAssignment.getAttachments().add(attachment);
            }
        }

        return assignmentRepository.save(newAssignment);
    }

    private String storeFile(MultipartFile file) throws IOException {
        if (file.getOriginalFilename() != null && (file.getOriginalFilename().contains(".."))){
            throw new IOException("File name contains invalid path sequence " + file.getOriginalFilename());
        }
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
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
    public Page<Assignment> getAllAssignmentsByClassId(long classId, Pageable pageable) {
        return assignmentRepository.findByClassroomId(classId, pageable);
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
    public Page<Assignment> getAllAssignmentsByTeacherId(Long teacherId, Pageable pageable) {
        return assignmentRepository.findByTeacherId(teacherId, pageable);
    }

    @Override
    @Transactional
    public void deleteAssignment(long id) {
        assignmentRepository.deleteById(id);
    }
}
