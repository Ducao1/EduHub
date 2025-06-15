package com.project.web_be.dtos.responses;

import com.project.web_be.entities.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class ListSubmissionResponse {
    private Long id;
    private LocalDateTime submittedAt;
    private Long examId;
    private String title;
    private String studentName;
    private Float score;

    public static ListSubmissionResponse fromSubmission(Submission submission) {
        return ListSubmissionResponse.builder()
                .id(submission.getId())
                .submittedAt(submission.getSubmittedAt())
                .examId(submission.getExam().getId())
                .title(submission.getExam().getTitle())
                .studentName(submission.getStudent().getFullName())
                .score(submission.getScore().getScore())
                .build();
    }
}
