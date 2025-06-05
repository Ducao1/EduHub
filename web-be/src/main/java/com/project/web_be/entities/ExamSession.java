package com.project.web_be.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exam_sessions")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExamSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isActive;

    @OneToMany(mappedBy = "examSession", cascade = CascadeType.ALL)
    private List<ExamProgress> progresses;
}

