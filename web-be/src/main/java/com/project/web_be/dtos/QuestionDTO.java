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
public class QuestionDTO {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("question_text")
    private String questionText;
    @JsonProperty("type")
    private String type;
    @JsonProperty("exam_id")
    private Long examId;
    @JsonProperty("answers")
    private List<AnswerDTO> answers;
    @JsonProperty("point")
    private float point;
}
