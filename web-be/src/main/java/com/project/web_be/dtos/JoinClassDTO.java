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
public class JoinClassDTO {
    @JsonProperty("student_id")
    private Long studentId;
//    @JsonProperty("class_id")
//    private Long classId;
    @JsonProperty("code")
    private String code;
}
