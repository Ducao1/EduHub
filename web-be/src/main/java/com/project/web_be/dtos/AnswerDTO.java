package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.web_be.entities.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {
    @JsonProperty("answer_text")
    private String answerText;
    @JsonProperty("is_correct")
    private boolean isCorrect;
    @JsonProperty("question_id")
    private Long questionId;

}
