package com.project.web_be.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.web_be.entities.Answer;
import com.project.web_be.entities.Question;
import com.project.web_be.entities.Submission;
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
