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
import com.project.web_be.services.EnrollmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {
    private final ClassroomRepository classroomRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public Enrollment addStudent(EnrollmentDTO enrollmentDTO) throws Exception {
        Classroom classroom = classroomRepository.findById(enrollmentDTO.getClassId())
                .orElseThrow(()-> new DataNotFoundException("Classroom doesn't exist"));
        User student = userRepository.findByEmail(enrollmentDTO.getEmail())
                .orElseThrow(()-> new DataNotFoundException("Email doesn't exist"));
        boolean isAlreadyEnrolled = enrollmentRepository.existsByClassroomAndStudent(classroom, student);
        if (isAlreadyEnrolled) {
            throw new Exception("Student is already enrolled in this classroom");
        }
        Enrollment newEnrollment = Enrollment.builder()
                .classroom(classroom)
                .student(student)
                .confirm(true)
                .build();

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
                .student(existingStudent)
                .confirm(false)
                .build();

        return enrollmentRepository.save(newEnrollment);
    }

    @Override
    public List<Classroom> getListClassByStudentId(Long studentId) {
        return enrollmentRepository.findClassesByStudentId(studentId);
    }

    @Override
    public List<User> getAllStudentInClass(Long id){
        List<Enrollment> enrollments = enrollmentRepository.findByClassroomIdAndConfirmTrue(id);
        return enrollments.stream().map(Enrollment::getStudent).toList();
    }

    @Override
    public List<User> getStudentsByClassId(Long classId) {
        return enrollmentRepository.findStudentsByClassroomId(classId);
    }

    public Enrollment approveStudent(Long enrollmentId) throws Exception {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new DataNotFoundException("Enrollment not found"));
        enrollment.setConfirm(true);
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public List<User> searchStudentsInClass(Long classId, String keyword) {
        return enrollmentRepository.searchStudentsInClass(classId, keyword);
    }

    @Override
    public List<User> getPendingStudentsInClass(Long classId) {
        List<Enrollment> enrollments = enrollmentRepository.findByClassroomIdAndConfirmFalse(classId);
        return enrollments.stream().map(Enrollment::getStudent).toList();
    }

    @Override
    public void approveAllPendingStudents(Long classId) throws Exception {
        List<Enrollment> enrollments = enrollmentRepository.findByClassroomIdAndConfirmFalse(classId);
        for (Enrollment enrollment : enrollments) {
            enrollment.setConfirm(true);
        }
        enrollmentRepository.saveAll(enrollments);
    }
}
