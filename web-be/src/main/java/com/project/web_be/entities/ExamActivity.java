package com.project.web_be.entities;

import lombok.Data;
import java.time.LocalDateTime;

import com.project.web_be.dtos.enums.ActivityType;

@Data
public class ExamActivity {
    private Long id;
    private Long examId;
    private Long studentId;
    private String studentName;
    private ActivityType activityType;
    private String description;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String browserInfo;
} 