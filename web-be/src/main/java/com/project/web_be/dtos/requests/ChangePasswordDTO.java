package com.project.web_be.dtos.requests;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private Long userId;
    private String oldPassword;
    private String newPassword;
} 