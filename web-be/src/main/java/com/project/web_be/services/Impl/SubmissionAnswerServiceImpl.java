package com.project.web_be.services.Impl;

import com.project.web_be.dtos.SubmissionAnswerDTO;
import com.project.web_be.entities.Answer;
import com.project.web_be.entities.Question;
import com.project.web_be.entities.Submission;
import com.project.web_be.entities.SubmissionAnswer;
import com.project.web_be.repositories.AnswerRepository;
import com.project.web_be.repositories.QuestionRepository;
import com.project.web_be.repositories.SubmissionAnswerRepository;
import com.project.web_be.repositories.SubmissionRepository;
import com.project.web_be.services.SubmissionAnswerService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionAnswerServiceImpl implements SubmissionAnswerService {
    private final SubmissionRepository submissionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    @Override
    public SubmissionAnswer submissionAnswer(SubmissionAnswerDTO submissionAnswerDTO) throws Exception {
        Question question = questionRepository.findById(submissionAnswerDTO.getQuestionId())
                .orElseThrow(()-> new EntityNotFoundException("Question not found"));
        Answer answer = answerRepository.findById(submissionAnswerDTO.getAnswerId())
                .orElseThrow(()-> new EntityNotFoundException("Answer not found"));
        Submission submission = submissionRepository.findById(submissionAnswerDTO.getSubmissionId())
                .orElseThrow(()-> new EntityNotFoundException("Submission not found"));

        SubmissionAnswer submissionAnswer = SubmissionAnswer.builder()
                .question(question)
                .answer(answer)
                .submission(submission)
                .build();

        return submissionAnswerRepository.save(submissionAnswer);
    }
}
