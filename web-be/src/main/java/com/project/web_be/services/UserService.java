package com.project.web_be.services;

import com.project.web_be.dtos.UserDTO;
import com.project.web_be.dtos.UserLoginDTO;
import com.project.web_be.entities.User;

public interface UserService {
    User register(UserDTO userDTO) throws Exception;

    String login(UserLoginDTO userLoginDTO) throws Exception;
    
    // Các method quản lý role
    String switchRole(String email, String newRoleName) throws Exception;
    
    String getCurrentRole(String email) throws Exception;
    
    User getUserByEmail(String email) throws Exception;
    
    void addRoleToUser(String email, String roleName) throws Exception;
    
    void removeRoleFromUser(String email, String roleName) throws Exception;
//    User getUserDetailsFromToken(String token) throws Exception;
//    User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception;
}
