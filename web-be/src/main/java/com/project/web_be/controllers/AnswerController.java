package com.project.web_be.controllers;

import com.project.web_be.dtos.AnswerDTO;
import com.project.web_be.entities.Answer;
import com.project.web_be.services.Impl.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/answers")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;

    @PostMapping("/add")
    public ResponseEntity<?> addAnswers(@RequestBody List<AnswerDTO> answerDTOs){
        try {
            List<Answer> answers = answerService.addAnswers(answerDTOs);
            return ResponseEntity.ok(answers);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnswer(@PathVariable long id){
        answerService.deleteAnswer(id);
        return ResponseEntity.ok("Delete answer successfully");
    }
}
