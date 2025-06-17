package com.project.web_be.dtos.responses;

import com.project.web_be.entities.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class AnswerResponse {
    private Long id;
    private String answerText;
    private boolean isCorrect;

    public static AnswerResponse fromAnswer(Answer answer) {
        return AnswerResponse.builder()
                .id(answer.getId())
                .answerText(answer.getAnswerText())
                .isCorrect(answer.isCorrect())
                .build();
    }
}
