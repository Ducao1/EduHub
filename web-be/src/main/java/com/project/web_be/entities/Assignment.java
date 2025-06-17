package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "assignments",
        indexes = {
                @Index(name = "idx_assignment_teacher_id", columnList = "teacher_id"),
                @Index(name = "idx_assignment_class_id", columnList = "class_id"),
                @Index(name = "idx_assignment_due_date", columnList = "due_date")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @OneToOne
    @JoinColumn(name = "class_id", nullable = false)
    @JsonManagedReference
    private Classroom classroom;
}