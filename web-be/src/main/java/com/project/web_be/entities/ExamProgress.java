package com.project.web_be.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// ExamProgress.java - Lưu tiến độ làm bài
@Entity
@Table(name = "exam_progresses")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exam_session_id")
    private ExamSession examSession;

    private int answeredQuestions;
    private int totalQuestions;
    private LocalDateTime lastActivity;
    private boolean isActive;
}