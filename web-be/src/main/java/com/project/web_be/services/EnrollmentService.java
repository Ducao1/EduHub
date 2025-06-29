package com.project.web_be.services;

import com.project.web_be.dtos.EnrollmentDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.User;
import com.project.web_be.dtos.responses.StudentResponse;

import java.util.List;

public interface EnrollmentService {
    Enrollment addStudent(EnrollmentDTO enrollmentDTO) throws Exception;

    Enrollment joinClassroom(JoinClassDTO joinClassDTO) throws Exception;

    List<Classroom> getListClassByStudentId(Long studentId);

    List<User> getAllStudentInClass(Long id);

    List<User> getStudentsByClassId(Long classId);

    Enrollment approveStudent(Long enrollmentId) throws Exception;

    List<User> searchStudentsInClass(Long classId, String keyword);

    List<StudentResponse> getPendingStudentsInClass(Long classId);

    void approveAllPendingStudents(Long classId) throws Exception;

    void removeStudentFromClass(Long classId, Long studentId) throws Exception;
}
