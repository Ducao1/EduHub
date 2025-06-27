package com.project.web_be.dtos.responses;

import com.project.web_be.dtos.enums.ExamStatusType;
import com.project.web_be.entities.ExamStatus;
import com.project.web_be.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentExamStatusResponse {
    private Long studentId;
    private String studentName;
    private String email;
    private String phoneNumber;
    private ExamStatusType status;
    private LocalDateTime startTime;
    private LocalDateTime submitTime;

    public static StudentExamStatusResponse fromUserAndExamStatus(User user, ExamStatus examStatus) {
        return StudentExamStatusResponse.builder()
                .studentId(user.getId())
                .studentName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .status(examStatus != null ? examStatus.getStatus() : ExamStatusType.NOT_STARTED)
                .startTime(examStatus != null ? examStatus.getStartTime() : null)
                .submitTime(examStatus != null ? examStatus.getSubmitTime() : null)
                .build();
    }
}