package com.project.web_be.dtos.responses;

import com.project.web_be.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class StudentResponse {
    private Long id;
    private String email;
    private String phoneNumber;
    private String fullName;

    public static StudentResponse fromStudent(User user){
        return StudentResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
