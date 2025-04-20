package com.project.web_be.responses;

import com.project.web_be.entities.Question;
import com.project.web_be.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class QuestionResponse {
    private Long id;
    private String questionText;
    private QuestionType type;
    private Float point;
    private Long examId;

    public static QuestionResponse fromQuestion(Question question){
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .type(question.getType())
                .point(question.getPoint())
                .examId((question.getExamId()))
                .build();
    }
}
