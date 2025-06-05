package com.project.web_be.controllers;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;
import com.project.web_be.responses.AssignmentResponse;
import com.project.web_be.services.Impl.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;
    @PostMapping("/add")
    public ResponseEntity<?> addAssignment(@RequestBody AssignmentDTO assignmentDTO){
        try {
            Assignment assignment = assignmentService.addAssignment(assignmentDTO);
            return ResponseEntity.ok(assignment);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAllAssignmentByTeacherId(@PathVariable("id") long id){
        try {
            Assignment assignment = assignmentService.getAssignmentById(id);
            return ResponseEntity.ok(AssignmentResponse.fromAssignment(assignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/class/{id}")
    public ResponseEntity<?> getAllAssignmentByClassId(@PathVariable long id){
        try {
            List<Assignment> assignments = assignmentService.getAllAssignmentsByClassId(id);
            List<AssignmentResponse> assignmentResponses = assignments.stream()
                    .map(AssignmentResponse::fromAssignment)
                    .toList();
            return ResponseEntity.ok(assignmentResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/teacher/{id}")
    public ResponseEntity<?> getAllAssignmentByTeacherId(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Assignment> assignments = assignmentService.getAllAssignmentsByTeacherId(id, pageable);
            Page<AssignmentResponse> assignmentResponses = assignments.map(AssignmentResponse::fromAssignment);
            return ResponseEntity.ok(assignmentResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@RequestBody AssignmentDTO assignmentDTO, @PathVariable long id){
        try {
            Assignment assignment = assignmentService.updateAssignment(assignmentDTO, id);
            return ResponseEntity.ok(assignment);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable long id){
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok("Delete assignment successfully");
    }
}
