package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "scores",
        indexes = {
                @Index(name = "idx_score_graded_by", columnList = "graded_by")
        })
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private float score;

    @ManyToOne
    @JoinColumn(name = "graded_by")
    private User gradedBy;

    @OneToOne
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonBackReference("submission-score")
    private Submission submission;
}