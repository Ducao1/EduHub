package com.project.web_be.dtos.responses;

import com.project.web_be.entities.Question;
import com.project.web_be.entities.SubmissionAnswer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class SubmissionAnswerResponse {
    private Long id;
    private Question question;

    public static SubmissionAnswerResponse fromSubmissionAnswer(SubmissionAnswer submissionAnswer) {
        return SubmissionAnswerResponse.builder()
                .id(submissionAnswer.getId())
                .question(submissionAnswer.getQuestion())
                .build();
    }

}
