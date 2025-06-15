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
    private String phoneNumber;
    private String password;
    private String fullName;

    public static StudentResponse fromStudent(User user){
        return StudentResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .password(user.getPassword())
                .build();
    }
}
