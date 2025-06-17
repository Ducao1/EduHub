package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "answers",
        indexes = {
                @Index(name = "idx_answer_question_id", columnList = "question_id")
        })
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "answer_text", nullable = false)
    private String answerText;

    @Column(name = "is_correct")
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private Question question;
}