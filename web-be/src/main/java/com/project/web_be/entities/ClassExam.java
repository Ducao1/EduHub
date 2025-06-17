package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "class_exams",
        indexes = {
                @Index(name = "idx_class_exam_exam_class", columnList = "exam_id, class_id"),
                @Index(name = "idx_class_exam_class_id", columnList = "class_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassExam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    @JsonBackReference
    private Classroom classroom;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    @JsonBackReference
    private Exam exam;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;
}