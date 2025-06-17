package com.project.web_be.dtos.requests;

import com.project.web_be.dtos.enums.ExamStatusType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamStatusUpdateRequest {
    private Long examId;
    private Long studentId;
    private ExamStatusType status;
    private Long classId;
} 