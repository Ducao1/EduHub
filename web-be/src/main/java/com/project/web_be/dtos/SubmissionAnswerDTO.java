package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubmissionAnswerDTO {
    @JsonProperty("answer_id")
    private Long answerId;
    @JsonProperty("score")
    private float score;
    @JsonProperty("question_id")
    private Long questionId;
    @JsonProperty("submission_id")
    private Long submissionId;
}
