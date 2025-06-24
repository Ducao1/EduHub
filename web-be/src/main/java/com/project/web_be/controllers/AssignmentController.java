package com.project.web_be.controllers;

import com.project.web_be.dtos.AssignmentDTO;
import com.project.web_be.entities.Assignment;
import com.project.web_be.dtos.responses.AssignmentResponse;
import com.project.web_be.services.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addAssignment(
            @ModelAttribute AssignmentDTO assignmentDTO,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            Assignment assignment = assignmentService.addAssignment(assignmentDTO, files);
            return ResponseEntity.ok(AssignmentResponse.fromAssignment(assignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAllAssignmentByTeacherId(@PathVariable("id") long id) {
        try {
            Assignment assignment = assignmentService.getAssignmentById(id);
            return ResponseEntity.ok(AssignmentResponse.fromAssignment(assignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/class/{id}")
    public ResponseEntity<?> getAllAssignmentByClassId(
            @PathVariable long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Assignment> assignments = assignmentService.getAllAssignmentsByClassId(id, pageable);
            Page<AssignmentResponse> assignmentResponses = assignments.map(AssignmentResponse::fromAssignment);
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
    public ResponseEntity<?> updateAssignment(@RequestBody AssignmentDTO assignmentDTO, @PathVariable long id) {
        try {
            Assignment assignment = assignmentService.updateAssignment(assignmentDTO, id);
            return ResponseEntity.ok(assignment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable long id) {
        assignmentService.deleteAssignment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message","Delete assignment successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Resource> getAssignmentFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
