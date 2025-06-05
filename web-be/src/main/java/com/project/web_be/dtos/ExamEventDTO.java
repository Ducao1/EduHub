package com.project.web_be.dtos;

import com.project.web_be.dtos.enums.ExamEventType;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExamEventDTO {
    private ExamEventType type;
    private Long studentId;
    private Object data;

    public ExamEventDTO(ExamEventType examEventType, Long studentId) {
    }
}