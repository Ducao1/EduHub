package com.project.web_be.controllers;

import com.project.web_be.dtos.ClassroomDTO;
import com.project.web_be.entities.Classroom;
import com.project.web_be.dtos.responses.ClassResponse;
import com.project.web_be.services.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/classes")
@RequiredArgsConstructor
public class ClassroomController {
    private final ClassroomService classroomService;

    @PostMapping("/add")
    public ResponseEntity<?> addClassroom(@RequestBody ClassroomDTO classroomDTO){
        try{
            Classroom classroom = classroomService.addClassroom(classroomDTO);
            return ResponseEntity.ok(classroom);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClassById(@PathVariable("id") long id){
        try {
            Classroom classroom = classroomService.getClassroomById(id);
            return ResponseEntity.ok(ClassResponse.fromClassroom(classroom));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getAllClasses(){
        try {
            List<Classroom> classrooms = classroomService.getAllClassrooms();
            List<ClassResponse> listClassResponses = classrooms.stream()
                    .map(ClassResponse::fromClassroom)
                    .toList();
            return ResponseEntity.ok(listClassResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClassroom(@RequestBody ClassroomDTO classroomDTO, @PathVariable long id){
        try {
            Classroom classroom = classroomService.updateClassroom(classroomDTO, id);
            return ResponseEntity.ok(ClassResponse.fromClassroom(classroom));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/refresh-code")
    public ResponseEntity<?> refreshClassCode(@PathVariable long id) {
        try {
            Classroom classroom = classroomService.updateClassCode(id);
            return ResponseEntity.ok(ClassResponse.fromClassroom(classroom));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getAllClassByTeacherId(@PathVariable Long teacherId) {
        try {
                List<Classroom> classrooms = classroomService.getClassByTeacherId(teacherId);
            List<ClassResponse> listClassResponses = classrooms.stream()
                    .map(ClassResponse::fromClassroom)
                    .toList();
            return ResponseEntity.ok(listClassResponses);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClassroom(@PathVariable long id){
        try {
            classroomService.deleteClassroom(id);
            Map<String, String> response = new HashMap<>();
            response.put("success", "delete class successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
