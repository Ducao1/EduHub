package com.project.web_be.services.Impl;

import com.project.web_be.dtos.UserDTO;
import com.project.web_be.entities.Role;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.RoleRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtTokenUtils jwtTokenUtil;
//    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public User register(UserDTO userDTO) throws Exception {
        String phoneNumber = userDTO.getPhoneNumber();
        if(userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        Role studentRole = roleRepository.findByName(Role.STUDENT)
                .orElseThrow(() -> new DataNotFoundException("Default role STUDENT not found"));

        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())
                .role(studentRole)
                .build();

        return userRepository.save(newUser);
    }

    public User login(UserDTO userDTO){
        Optional<User> optionalUser = userRepository.findByPhoneNumber(userDTO.getPhoneNumber());
        if (optionalUser.isPresent() && userDTO.getPassword().equals(optionalUser.get().getPassword())){
            return optionalUser.get();
        }
        return null;
    }

    public User getStudentById(Long studentId) throws DataNotFoundException {
          return userRepository.findById(studentId)
                  .orElseThrow(()-> new DataNotFoundException("Student not found"));
    }
//    @Override
//    public String login(UserLoginDTO userLoginDTO) throws Exception {
//        Optional<User> optionalUser = userRepository.findByPhoneNumber(userLoginDTO.getPhoneNumber());
//        if(optionalUser.isEmpty()) {
//            throw new DataNotFoundException("phone number not found");
//        }
////        User existingUser = optionalUser.get();
//        if(!passwordEncoder.matches(userLoginDTO.getPassword(), existingUser.getPassword())) {
//                throw new BadCredentialsException("password not match");
//        }
//
//        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                userLoginDTO.getPhoneNumber(),
//                userLoginDTO.getPassword(),
//                existingUser.getAuthorities()
//        );
//
//        authenticationManager.authenticate(authenticationToken);
//        return jwtTokenUtil.generateToken(existingUser);
//        return "";
//    }


}
