package com.project.web_be.controllers;

import com.project.web_be.dtos.AssignExamDTO;
import com.project.web_be.dtos.UpdateExamDateDTO;
import com.project.web_be.entities.ClassExam;
import com.project.web_be.dtos.responses.AssignedExamResponse;
import com.project.web_be.services.Impl.ClassroomExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> getExamByClassId(
            @PathVariable long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ClassExam> classExams = classroomExamService.getExamByClassroomId(id,pageable);
            Page<AssignedExamResponse> assignedExamResponses = classExams
                    .map(AssignedExamResponse::fromClassExam);
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
