package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "submission_answers",
        indexes = {
                @Index(name = "idx_submission_answer_submission_id", columnList = "submission_id"),
                @Index(name = "idx_submission_answer_question_id", columnList = "question_id")
        })
public class SubmissionAnswer extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "answer_id", nullable = false)
    private Answer answer;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonBackReference("submission-submissionAnswers")
    private Submission submission;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
}