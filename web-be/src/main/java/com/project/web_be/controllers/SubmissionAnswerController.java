package com.project.web_be.controllers;

import com.project.web_be.dtos.SubmissionAnswerDTO;
import com.project.web_be.entities.SubmissionAnswer;
import com.project.web_be.responses.SubmissionAnswerResponse;
import com.project.web_be.services.Impl.SubmissionAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/submissionAnswers")
@RequiredArgsConstructor
public class SubmissionAnswerController {
    private final SubmissionAnswerService submissionAnswerService;

    @PostMapping("")
    public ResponseEntity<?> submissionAnswer(@RequestBody SubmissionAnswerDTO submissionAnswerDTO){
        try {
            SubmissionAnswer submissionAnswer = submissionAnswerService.submissionAnswer(submissionAnswerDTO);
            return ResponseEntity.ok(SubmissionAnswerResponse.fromSubmissionAnswer(submissionAnswer));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
