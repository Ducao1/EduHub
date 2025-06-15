package com.project.web_be.controllers;

import com.project.web_be.dtos.QuestionDTO;
import com.project.web_be.entities.Question;
import com.project.web_be.services.Impl.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @PostMapping("/add")
    public ResponseEntity<?> addQuestion(@RequestBody QuestionDTO questionDTO){
        try {
            Question question = questionService.addQuestion(questionDTO);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, questionDTO);
            return ResponseEntity.ok(updatedQuestion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable long id){
        try {
            Question question = questionService.getQuestionById(id);
//            return ResponseEntity.ok(QuestionResponse.fromQuestion(question));
            return ResponseEntity.ok(question);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable long id){
        questionService.deleteQuestion(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Delete question successfully");
        return ResponseEntity.ok(response);
    }

}
