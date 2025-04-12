package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "scores")
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
