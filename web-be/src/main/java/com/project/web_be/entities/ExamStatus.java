package com.project.web_be.entities;

import com.project.web_be.dtos.enums.ExamStatusType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_status",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"exam_id", "student_id"})
        },
        indexes = {
                @Index(name = "idx_exam_status_status", columnList = "status")
        })
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExamStatus extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "status", length = 32)
    @Enumerated(EnumType.STRING)
    private ExamStatusType status;;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "submit_time")
    private LocalDateTime submitTime;
}