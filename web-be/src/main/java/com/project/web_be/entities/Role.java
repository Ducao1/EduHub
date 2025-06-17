package com.project.web_be.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "roles",
        indexes = {
                @Index(name = "idx_role_name", columnList = "name")
        })
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    public static String ADMIN = "ADMIN";
    public static String STUDENT = "STUDENT";
    public static String TEACHER = "TEACHER";
}