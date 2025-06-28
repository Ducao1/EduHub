package com.project.web_be.controllers;


import com.project.web_be.dtos.EnrollmentDTO;
import com.project.web_be.dtos.JoinClassDTO;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.User;
import com.project.web_be.dtos.responses.ClassResponse;
import com.project.web_be.dtos.responses.StudentResponse;
import com.project.web_be.services.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;

import java.util.List;
import com.project.web_be.repositories.ClassroomRepository;

@RestController
@RequestMapping("${api.prefix}/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;
    private final ClassroomRepository classroomRepository;

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
    public ResponseEntity<List<ClassResponse>> getAllClassByStudentId(@PathVariable Long studentId) {
        List<ClassResponse> classResponseList = enrollmentService.getListClassByStudentId(studentId)
                .stream()
                .map(ClassResponse::fromClassroom)
                .toList();
        return ResponseEntity.ok(classResponseList);
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<?> getAllStudentByClassId(@PathVariable Long classId) {
        try {
            List<User> studentList = enrollmentService.getAllStudentInClass(classId);
            List<StudentResponse> studentResponses = studentList.stream()
                    .map(StudentResponse::fromStudent)
                    .toList();
            return ResponseEntity.ok(studentResponses);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/approve/{enrollmentId}")
    public ResponseEntity<?> approveStudent(@PathVariable Long enrollmentId) {
        try {
            Enrollment enrollment = enrollmentService.approveStudent(enrollmentId);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/class/{classId}/export")
    public ResponseEntity<byte[]> exportStudentsInClassToExcel(@PathVariable Long classId) {
        try {
            List<User> studentList = enrollmentService.getAllStudentInClass(classId);
            String className = "";
            try {
                className = classroomRepository.findById(classId).map(c -> c.getName()).orElse(String.valueOf(classId));
            } catch (Exception e) {
                className = String.valueOf(classId);
            }
            String safeTitle = className.replaceAll("[^a-zA-Z0-9_-]", "_");
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet(className);
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("STT");
            header.createCell(1).setCellValue("Họ và tên");
            header.createCell(2).setCellValue("Email");
            header.createCell(3).setCellValue("Số điện thoại");
            int rowIdx = 1;
            for (int i = 0; i < studentList.size(); i++) {
                User s = studentList.get(i);
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(s.getFullName());
                row.createCell(2).setCellValue(s.getEmail() != null ? s.getEmail() : "");
                row.createCell(3).setCellValue(s.getPhoneNumber() != null ? s.getPhoneNumber() : "");
            }
            for (int i = 0; i <= 3; i++) sheet.autoSizeColumn(i);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();
            byte[] bytes = out.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=list_student_" + safeTitle + ".xlsx");
            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/class/{classId}/search")
    public ResponseEntity<?> searchStudentsInClass(@PathVariable Long classId, @RequestParam String keyword) {
        try {
            String trimmedKeyword = keyword == null ? "" : keyword.trim();
            List<User> studentList = enrollmentService.searchStudentsInClass(classId, trimmedKeyword);
            List<StudentResponse> studentResponses = studentList.stream()
                    .map(StudentResponse::fromStudent)
                    .toList();
            return ResponseEntity.ok(studentResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}