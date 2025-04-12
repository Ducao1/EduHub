package com.project.web_be.responses;

import com.project.web_be.entities.Classroom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class ClasssResponse {
    private long id;
    private String name;
    private String description;

    public static ClasssResponse fromClassroom(Classroom classroom){
        return ClasssResponse.builder()
                .id(classroom.getId())
                .name(classroom.getName())
                .description(classroom.getDescription())
                .build();
    }

    public static List<ClasssResponse> fromClassroomList(List<Classroom> classrooms){
        return classrooms.stream()
                .map(ClasssResponse::fromClassroom)
                .collect(Collectors.toList());
    }
}
