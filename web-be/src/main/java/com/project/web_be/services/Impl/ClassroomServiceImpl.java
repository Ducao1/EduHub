package com.project.web_be.services.Impl;

import com.project.web_be.components.ClassCodeGenerator;
import com.project.web_be.dtos.ClassroomDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.ClassroomRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.ClassroomService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassroomServiceImpl implements ClassroomService {
    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;
    private final ClassCodeGenerator classCodeGenerator;

    private String generateCode() {
        String code;
        do {
            code = classCodeGenerator.generate();
        } while (classroomRepository.existsByCode(code));

        return code;
    }

    @Override
    public Classroom addClassroom(ClassroomDTO classroomDTO) throws Exception {
        User teacher = userRepository.findById(classroomDTO.getTeacherId())
                .orElseThrow(()-> new EntityNotFoundException("Teacher doesn't exist"));
        if (!teacher.getRole().getName().equals("TEACHER")){
            throw new DataNotFoundException("Role is not teacher");
        }
            Classroom newClassroom = Classroom.builder()
                    .name(classroomDTO.getName())
                    .description(classroomDTO.getDescription())
                    .code(generateCode())
                    .isActive(true)
                    .teacher(teacher).build();

            return classroomRepository.save(newClassroom);
    }

    @Override
    public Classroom getClassroomById(long id) throws Exception{
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);
        if (optionalClassroom.isPresent()){
            return optionalClassroom.get();
        }
        throw new DataNotFoundException("Cannot find classroom with id: "+id);
    }

    @Override
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    @Override
    @Transactional
    public Classroom updateClassroom(ClassroomDTO classroomDTO, long id) throws Exception {
        Classroom existingClassroom = getClassroomById(id);
        if (existingClassroom!=null){
            existingClassroom.setName(classroomDTO.getName());
            existingClassroom.setDescription(classroomDTO.getDescription());
            existingClassroom.setTeacher(existingClassroom.getTeacher());
            existingClassroom.setActive(true);
        }
        return classroomRepository.save(existingClassroom);
    }

    @Transactional
    @Override
    public Classroom updateClassCode(long id) throws Exception{
        Classroom existingClassroom = getClassroomById(id);
        String oldCode = existingClassroom.getCode();
        String newCode;

        do {
            newCode = classCodeGenerator.generate();
        } while (classroomRepository.existsByCode(newCode) || newCode.equals(oldCode));

        existingClassroom.setCode(newCode);
        return classroomRepository.save(existingClassroom);
    }

    @Override
    public List<Classroom> getClassByTeacherId(Long teacherId) {
        return classroomRepository.findByTeacherId(teacherId);
    }

    @Override
    @Transactional
    public void deleteClassroom(long id) {
        classroomRepository.deleteById(id);
    }
}
