package com.project.web_be.entities;

import com.project.web_be.dtos.enums.ExamStatusType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_status")
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

    @Enumerated(EnumType.STRING)
    private ExamStatusType status;

    @Column(name = "start_time")
    private Long startTime;

    @Column(name = "submit_time")
    private Long submitTime;
}

