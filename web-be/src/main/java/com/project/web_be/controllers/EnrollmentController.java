package com.project.web_be.controllers;


import com.project.web_be.dtos.EnrollmentDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.User;
import com.project.web_be.services.Impl.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @PostMapping("/add")
    public ResponseEntity<?> addStudent(@RequestBody EnrollmentDTO enrollmentDTO){
        try{
            Enrollment enrollment = enrollmentService.addStudent(enrollmentDTO);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestBody JoinClassDTO joinClassDTO){
        try{
            Enrollment enrollment = enrollmentService.joinClassroom(joinClassDTO);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/student/{studentId}")
    public List<Classroom> getStudentClasses(@PathVariable Long studentId) {
        return enrollmentService.getStudentClasses(studentId);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<?> getAllStudentInClass(@PathVariable Long classId) {
        try {
            List<User> userList = enrollmentService.getAllStudentInClass(classId);
            return ResponseEntity.ok(userList);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}