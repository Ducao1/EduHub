package com.project.web_be.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
public class UpdateUserDTO {
    private String fullName;
    private String phoneNumber;
    private String email;
    private Boolean gender;
    private String dob;
    private MultipartFile avatar;
} 