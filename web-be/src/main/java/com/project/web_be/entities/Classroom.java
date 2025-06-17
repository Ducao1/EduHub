package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "classes",
        indexes = {
                @Index(name = "idx_classroom_teacher_id", columnList = "teacher_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classroom extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonIgnore
    private User teacher;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "code")
    private String code;

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL)
    private List<ClassExam> classExams;
}