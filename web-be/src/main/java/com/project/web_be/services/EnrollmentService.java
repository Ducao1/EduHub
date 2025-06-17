package com.project.web_be.services;

import com.project.web_be.dtos.EnrollmentDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.User;

import java.util.List;

public interface EnrollmentService {
    Enrollment addStudent(EnrollmentDTO enrollmentDTO) throws Exception;

    Enrollment joinClassroom(JoinClassDTO joinClassDTO) throws Exception;

    List<Classroom> getListClassByStudentId(Long studentId);

    List<User> getAllStudentInClass(Long id);

    List<User> getStudentsByClassId(Long classId);
}
