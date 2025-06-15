package com.project.web_be.dtos.responses;

import com.project.web_be.entities.Classroom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class ClassResponse {
    private long id;
    private String name;
    private String description;
    private String code;
    private boolean isActive;

    public static ClassResponse fromClassroom(Classroom classroom) {
        return ClassResponse.builder()
            .id(classroom.getId())
            .name(classroom.getName())
            .description(classroom.getDescription())
            .code(classroom.getCode())
            .isActive(classroom.isActive())
            .build();
    }
}
