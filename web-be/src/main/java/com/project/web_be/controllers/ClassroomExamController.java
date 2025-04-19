package com.project.web_be.controllers;

import com.project.web_be.dtos.AssignExamDTO;
import com.project.web_be.dtos.UpdateExamDateDTO;
import com.project.web_be.entities.ClassExam;
import com.project.web_be.responses.AssignedExamResponse;
import com.project.web_be.services.Impl.ClassroomExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/class/exams")
@RequiredArgsConstructor
public class ClassroomExamController {
    private final ClassroomExamService classroomExamService;
    @PostMapping("/add")
    public ResponseEntity<?> addExamToClass(@RequestBody AssignExamDTO assignExamDTO){
        try {
            ClassExam classExam = classroomExamService.assignExam(assignExamDTO);
            return ResponseEntity.ok(classExam);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExamByClass(@PathVariable Long id){
        try {
            List<ClassExam> classExams = classroomExamService.getExamByClassroomId(id);
            List<AssignedExamResponse> assignedExamResponses = classExams.stream()
                    .map(AssignedExamResponse::fromClassExam)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(assignedExamResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClassroomExam(@RequestBody UpdateExamDateDTO updateExamDateDTO,
                                                       @PathVariable long id){
        try {
            ClassExam classExam = classroomExamService.updateExamDate(updateExamDateDTO,id);
            return ResponseEntity.ok(classExam);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
