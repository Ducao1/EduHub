package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AnswerDTO;
import com.project.web_be.dtos.QuestionDTO;
import com.project.web_be.entities.Answer;
import com.project.web_be.entities.Exam;
import com.project.web_be.entities.Question;
import com.project.web_be.dtos.enums.QuestionType;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.InvalidParamException;
import com.project.web_be.repositories.ExamRepository;
import com.project.web_be.repositories.QuestionRepository;
import com.project.web_be.services.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public Question addQuestion(QuestionDTO questionDTO) throws Exception {
        Exam exam = examRepository.findById(questionDTO.getExamId())
                .orElseThrow(() -> new DataNotFoundException("Exam not found"));

        QuestionType questionType;
        try {
            questionType = QuestionType.valueOf(questionDTO.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidParamException("Question type not valid: " + questionDTO.getType());
        }

        Question newQuestion = Question.builder()
                .questionText(questionDTO.getQuestionText())
                .exam(exam)
                .type(questionType)
                .point(questionDTO.getPoint())
                .build();
        questionRepository.save(newQuestion);

        if (questionDTO.getAnswers() != null && !questionDTO.getAnswers().isEmpty()) {
            List<Answer> answers = questionDTO.getAnswers().stream()
                    .map(answerDTO -> Answer.builder()
                            .answerText(answerDTO.getAnswerText())
                            .isCorrect(answerDTO.isCorrect())
                            .question(newQuestion)
                            .build())
                    .collect(Collectors.toList());
            newQuestion.setAnswers(answers);
        }

        return newQuestion;
    }


    @Transactional
    @Override
    public Question updateQuestion(long id, QuestionDTO questionDTO) throws DataNotFoundException {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy câu hỏi với ID: " + id));

        if (questionDTO.getQuestionText() == null || questionDTO.getQuestionText().trim().isEmpty()) {
            throw new IllegalArgumentException("Câu hỏi không được để trống.");
        }

        if (questionDTO.getAnswers() == null || questionDTO.getAnswers().isEmpty()) {
            throw new IllegalArgumentException("Phải có ít nhất một đáp án.");
        }

        question.setQuestionText(questionDTO.getQuestionText());
        question.setType(QuestionType.valueOf(questionDTO.getType()));
        question.setPoint(questionDTO.getPoint());

        List<Answer> existingAnswers = question.getAnswers();

        List<AnswerDTO> newAnswers = questionDTO.getAnswers().stream()
                .filter(a -> a.getAnswerText() != null && !a.getAnswerText().trim().isEmpty())
                .collect(Collectors.toList());

        existingAnswers.removeIf(existingAnswer ->
            newAnswers.stream()
                .noneMatch(newAnswer ->
                    newAnswer.getAnswerText().equals(existingAnswer.getAnswerText())
                )
        );

        for (AnswerDTO newAnswer : newAnswers) {
            Answer existingAnswer = existingAnswers.stream()
                    .filter(a -> a.getAnswerText().equals(newAnswer.getAnswerText()))
                    .findFirst()
                    .orElse(null);

            if (existingAnswer != null) {
                existingAnswer.setCorrect(newAnswer.isCorrect());
            } else {
                Answer answer = Answer.builder()
                        .answerText(newAnswer.getAnswerText())
                        .isCorrect(newAnswer.isCorrect())
                        .question(question)
                        .build();
                existingAnswers.add(answer);
            }
        }

        return questionRepository.save(question);
    }


    @Override
    public Question getQuestionById(long id) throws DataNotFoundException {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()){
            return optionalQuestion.get();
        }
        throw new DataNotFoundException("Cannot find assignment with id: "+id);
    }

    @Override
    public List<Question> getAllQuestions() {
        return List.of();
    }

    @Override
    @Transactional
    public void deleteQuestion(long id) {
        questionRepository.deleteById(id);
    }
}
