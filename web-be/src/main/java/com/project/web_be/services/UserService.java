package com.project.web_be.services;

import com.project.web_be.dtos.UserDTO;
import com.project.web_be.dtos.UserLoginDTO;
import com.project.web_be.entities.User;

public interface UserService {
    User register(UserDTO userDTO) throws Exception;

    String login(UserLoginDTO userLoginDTO) throws Exception;
//    User getUserDetailsFromToken(String token) throws Exception;
//    User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception;
}
