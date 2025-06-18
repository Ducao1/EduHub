package com.project.web_be.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

//@Entity(name = "exam_activities")
@Entity
@Data
@Builder
public class ExamActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "exam_id")
    private Long examId;
    @Column(name = "class_id")
    private Long classId;
    @Column(name = "student_id")
    private Long studentId;
    private String activityType;
    private LocalDateTime timestamp;
}