package com.project.web_be.services;

import com.project.web_be.dtos.EnrollmentDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.Enrollment;

import java.util.List;

public interface IEnrollmentService {
    Enrollment addStudent(EnrollmentDTO enrollmentDTO) throws Exception;

    Enrollment joinClassroom(JoinClassDTO joinClassDTO) throws Exception;
}
