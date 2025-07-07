package com.project.web_be.services;

import com.project.web_be.dtos.AnswerDTO;
import com.project.web_be.entities.Answer;

import java.util.List;

public interface AnswerService {
    List<Answer> addAnswers(List<AnswerDTO> answerDTOs) throws Exception;
    void deleteAnswer(long id);
}
