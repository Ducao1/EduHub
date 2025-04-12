package com.project.web_be.services.Impl;

import com.project.web_be.dtos.EnrollmentDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.InvalidParamException;
import com.project.web_be.repositories.ClassroomRepository;
import com.project.web_be.repositories.EnrollmentRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.IEnrollmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService implements IEnrollmentService {
    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public Enrollment addStudent(EnrollmentDTO enrollmentDTO) throws Exception {
        Classroom classroom = classroomRepository.findById(enrollmentDTO.getClassId())
                .orElseThrow(()-> new DataNotFoundException("Classroom doesn't exist"));
        User student = userRepository.findByPhoneNumber(enrollmentDTO.getPhoneNumber())
                .orElseThrow(()-> new DataNotFoundException("Phone number doesn't exist"));
        boolean isAlreadyEnrolled = enrollmentRepository.existsByClassroomAndStudent(classroom, student);
        if (isAlreadyEnrolled) {
            throw new Exception("Student is already enrolled in this classroom");
        }
        Enrollment newEnrollment = Enrollment.builder()
                .classroom(classroom)
                .student(student).build();

        return enrollmentRepository.save(newEnrollment);
    }

    @Override
    public Enrollment joinClassroom(JoinClassDTO joinClassDTO) throws Exception {
        User existingStudent = userRepository.findById(joinClassDTO.getStudentId())
                .orElseThrow(()-> new EntityNotFoundException("Student doesn't exist"));
        Classroom existingClassroom = classroomRepository.findByCode(joinClassDTO.getCode())
                .orElseThrow(() -> new InvalidParamException("Mã lớp không hợp lệ"));

        if (enrollmentRepository.existsByClassroomAndStudent(existingClassroom, existingStudent)) {
            throw new InvalidParamException("Bạn đã tham gia lớp học này");
        }
        if (!existingClassroom.isActive()) {
            throw new InvalidParamException("Lớp học này đã bị khóa");
        }

        Enrollment newEnrollment = Enrollment.builder()
                .classroom(existingClassroom)
                .student(existingStudent).build();

        return enrollmentRepository.save(newEnrollment);
    }

    public List<Classroom> getStudentClasses(Long studentId) {
        return enrollmentRepository.findClassesByStudentId(studentId);
    }

    public List<User> getAllStudentInClass(Long id){
        return enrollmentRepository.findStudentsByClassroomId(id);
    }

    public List<User> getStudentsByClassId(Long classId) {
        return enrollmentRepository.findStudentsByClassroomId(classId);
    }
}
