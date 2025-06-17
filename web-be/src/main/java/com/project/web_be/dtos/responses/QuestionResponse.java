package com.project.web_be.dtos.responses;

import com.project.web_be.entities.Question;
import com.project.web_be.dtos.enums.QuestionType;

import lombok.*;


import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class QuestionResponse {
    private Long id;
    private String questionText;
    private QuestionType type;
    private float point;
    private List<AnswerResponse> answers;

    public static QuestionResponse fromQuestion(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .type(question.getType())
                .point(question.getPoint())
                .answers(question.getAnswers() != null ?
                        question.getAnswers().stream()
                                .map(AnswerResponse::fromAnswer)
                                .collect(Collectors.toList()) : null)
                .build();
    }
}
