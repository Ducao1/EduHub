package com.project.web_be.services;

import com.project.web_be.dtos.QuestionDTO;
import com.project.web_be.entities.Question;
import com.project.web_be.exceptions.DataNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface IQuestionService {
    Question addQuestion(QuestionDTO questionDTO) throws Exception;

    Question updateQuestion(long id, QuestionDTO questionDTO) throws DataNotFoundException;

    Question getQuestionById(long id) throws DataNotFoundException;
    List<Question> getAllQuestions();
    void deleteQuestion(long id);
}
