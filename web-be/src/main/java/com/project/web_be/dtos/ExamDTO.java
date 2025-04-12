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
public class ExamDTO {
    @JsonProperty("title")
    private String title;
    @JsonProperty("teacher_id")
    private Long teacherId;
    @JsonProperty("duration")
    private Long duration;
}
