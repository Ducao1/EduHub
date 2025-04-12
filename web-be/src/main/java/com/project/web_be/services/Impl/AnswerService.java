package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AnswerDTO;
import com.project.web_be.entities.Answer;
import com.project.web_be.entities.Question;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.AnswerRepository;
import com.project.web_be.repositories.QuestionRepository;
import com.project.web_be.services.IAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnswerService implements IAnswerService {
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    @Override
    public List<Answer> addAnswers(List<AnswerDTO> answerDTOs) throws Exception {
        List<Answer> answers = new ArrayList<>();

        for (AnswerDTO answerDTO : answerDTOs) {
            Question question = questionRepository.findById(answerDTO.getQuestionId())
                    .orElseThrow(() -> new DataNotFoundException("Question not found with ID: " + answerDTO.getQuestionId()));

            Answer newAnswer = Answer.builder()
                    .answerText(answerDTO.getAnswerText())
                    .isCorrect(answerDTO.isCorrect())
                    .question(question)
                    .build();
            answers.add(newAnswer);
        }

        return answerRepository.saveAll(answers);
    }


    @Override
    @Transactional
    public void deleteAnswer(long id) {
        answerRepository.deleteById(id);
    }
}
