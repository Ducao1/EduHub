package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "submissions",
        indexes = {
                @Index(name = "idx_submission_exam_id", columnList = "exam_id"),
                @Index(name = "idx_submission_assignment_id", columnList = "assignment_id"),
                @Index(name = "idx_submission_student_id", columnList = "student_id"),
                @Index(name = "idx_submission_submitted_at", columnList = "submittedAt")
        })
public class Submission extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime submittedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("submission-submissionAnswers")
    private List<SubmissionAnswer> submissionAnswers;

    @OneToOne(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("submission-score")
    private Score score;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("submission-attachments")
    private List<Attachment> attachments;
}