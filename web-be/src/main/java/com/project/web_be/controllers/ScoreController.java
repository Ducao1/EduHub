package com.project.web_be.controllers;

import com.project.web_be.entities.Score;
import com.project.web_be.services.Impl.ScoreServiceImpl;
import com.project.web_be.services.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.project.web_be.dtos.ScoreDTO;
import com.project.web_be.dtos.ScoreAssignmentResponseDTO;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;
import com.project.web_be.services.AssignmentService;
import com.project.web_be.services.ExamService;

@RestController
@RequestMapping("${api.prefix}/scores")
@RequiredArgsConstructor
public class ScoreController {
    private final ScoreServiceImpl scoreService;
    private final AssignmentService assignmentService;
    private final ExamService examService;

    @PostMapping("/auto-grade/{submissionId}")
    public ResponseEntity<?> autoGrade(@PathVariable Long submissionId) {
        try {
            Score score = scoreService.autoGradeSubmission(submissionId);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/manual-grade")
    public ResponseEntity<?> manualGrade(@RequestParam Long submissionId,
                                         @RequestParam Long teacherId,
                                         @RequestParam float totalScore) {
        try {
            Score score = scoreService.manualGradeSubmission(submissionId, teacherId, totalScore);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/grade")
    public ResponseEntity<?> gradeSubmission(@RequestBody ScoreDTO scoreDTO) {
        try {
            Score score = scoreService.gradeSubmission(scoreDTO);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<?> getScoresBySubmissionId(@PathVariable long id){
        try {
            return ResponseEntity.ok(scoreService.getScoreBySubmissionId(id));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<?> getScoresByAssignmentId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(scoreService.getScoresByAssignmentId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<?> getScoresByExamId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(scoreService.getScoresByExamId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/exams/student/{studentId}")
    public ResponseEntity<?> getExamScoresByStudentId(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok(scoreService.getExamScoresByStudentId(studentId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/student/{studentId}")
    public ResponseEntity<?> getAssignmentScoresByStudentId(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok(scoreService.getAssignmentScoresByStudentId(studentId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assignments/{id}/export")
    public ResponseEntity<byte[]> exportAssignmentScoresToExcel(@PathVariable Long id) {
        try {
            var scores = scoreService.getScoresByAssignmentId(id);
            String assignmentTitle = "";
            try {
                var assignment = assignmentService.getAssignmentById(id);
                assignmentTitle = assignment.getTitle();
            } catch (Exception e) {
                assignmentTitle = String.valueOf(id);
            }
            String safeTitle = assignmentTitle.replaceAll("[^a-zA-Z0-9_-]", "_");
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet(assignmentTitle);
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("STT");
            header.createCell(1).setCellValue("Họ và tên");
            header.createCell(2).setCellValue("Email");
            header.createCell(3).setCellValue("Điểm");
            int rowIdx = 1;
            for (int i = 0; i < scores.size(); i++) {
                var s = scores.get(i);
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(s.getStudentName());
                row.createCell(2).setCellValue(s.getStudentEmail() != null ? s.getStudentEmail() : "");
                row.createCell(3).setCellValue(s.getScore());
            }
            for (int i = 0; i <= 3; i++) sheet.autoSizeColumn(i);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();
            byte[] bytes = out.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=score_" + safeTitle + ".xlsx");
            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/exams/{id}/export")
    public ResponseEntity<byte[]> exportExamScoresToExcel(@PathVariable Long id) {
        try {
            var scores = scoreService.getScoresByExamId(id);
            String examTitle = "";
            try {
                var exam = examService.getExamById(id);
                examTitle = exam.getTitle();
            } catch (Exception e) {
                examTitle = String.valueOf(id);
            }
            String safeTitle = examTitle.replaceAll("[^a-zA-Z0-9_-]", "_");
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet(examTitle);
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("STT");
            header.createCell(1).setCellValue("Họ và tên");
            header.createCell(2).setCellValue("Điểm");
            header.createCell(3).setCellValue("Thời gian nộp");
            int rowIdx = 1;
            for (int i = 0; i < scores.size(); i++) {
                var s = scores.get(i);
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(s.getStudentName());
                row.createCell(2).setCellValue(s.getTotalScore());
                row.createCell(3).setCellValue(s.getSubmittedAt() != null ? s.getSubmittedAt().toString() : "");
            }
            for (int i = 0; i <= 3; i++) sheet.autoSizeColumn(i);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();
            byte[] bytes = out.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=score_" + safeTitle + ".xlsx");
            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

//    @GetMapping("/users/{id}")
//    public ResponseEntity<?> getScoresByUserId(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok(scoreService.getScoresByUserId(id));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
}
