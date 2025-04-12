package com.project.web_be.responses;

import com.project.web_be.entities.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class SubmitExamResponse {
    private long id;
    private LocalDateTime submittedAt;
    private String title;
    private Float score;
    private List<SubmissionAnswerResponse> submissionAnswer;

    public static SubmitExamResponse fromSubmission(Submission submission){
        return SubmitExamResponse.builder()
                .id(submission.getId())
                .submittedAt(submission.getSubmittedAt())
                .title(submission.getExam().getTitle())
                .score(submission.getScore().getScore())
                .submissionAnswer(
                        submission.getSubmissionAnswers()
                                .stream()
                                .map(SubmissionAnswerResponse::fromSubmissionAnswer)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
