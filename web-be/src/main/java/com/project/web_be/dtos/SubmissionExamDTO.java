package com.project.web_be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionExamDTO {
    @JsonProperty("exam_id")
    private Long examId;

    @JsonProperty("student_id")
    private Long studentId;

    @JsonProperty("answers")
    private List<SubmissionAnswerDTO> answers;
} 