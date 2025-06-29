package com.project.web_be.services;

import com.project.web_be.dtos.UserDTO;
import com.project.web_be.dtos.UserLoginDTO;
import com.project.web_be.dtos.UpdateUserDTO;
import com.project.web_be.dtos.responses.StudentTaskWithStudentResponse;
import com.project.web_be.entities.User;

import java.util.List;

public interface UserService {
    User register(UserDTO userDTO) throws Exception;

    String login(UserLoginDTO userLoginDTO) throws Exception;

    User getUserById(Long id);
    
    // Các method quản lý role
    String switchRole(String email, String newRoleName) throws Exception;
    
    String getCurrentRole(String email) throws Exception;
    
    User getUserByEmail(String email) throws Exception;
    
    void addRoleToUser(String email, String roleName) throws Exception;
    
    void removeRoleFromUser(String email, String roleName) throws Exception;

    User updateUser(Long id, UpdateUserDTO updateUserDTO) throws Exception;
    
    // Method lấy danh sách bài tập và bài thi của sinh viên theo lớp
    StudentTaskWithStudentResponse getStudentTasksByClass(Long studentId) throws Exception;
    
    // Method lấy danh sách bài tập và bài thi của sinh viên trong một lớp cụ thể
    StudentTaskWithStudentResponse getStudentTasksInClass(Long studentId, Long classId) throws Exception;
//    User getUserDetailsFromToken(String token) throws Exception;
}
