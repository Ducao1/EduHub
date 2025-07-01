package com.project.web_be.entities;

import com.project.web_be.dtos.enums.ActivityType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity(name = "exam_activities")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
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
    @Column(name = "activity_type", length = 32)
    @Enumerated(EnumType.STRING)
    private ActivityType activityType;
    private LocalDateTime timestamp;
}