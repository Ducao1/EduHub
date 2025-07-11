package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScoreDTO {
    @JsonProperty("submission_id")
    private Long submissionId;

    @JsonProperty("graded_by_id")
    private Long gradedById;

    @JsonProperty("total_score")
    private float totalScore;

    private String studentName;
    private java.time.LocalDateTime submittedAt;

    public ScoreDTO(Long id, String studentName, Float score, java.time.LocalDateTime submittedAt) {
        this.submissionId = id;
        this.studentName = studentName;
        this.totalScore = score;
        this.submittedAt = submittedAt;
    }
}


