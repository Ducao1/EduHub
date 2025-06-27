package com.project.web_be.services.Impl;

import com.project.web_be.components.JwtTokenUtils;
import com.project.web_be.dtos.UserDTO;
import com.project.web_be.dtos.UserLoginDTO;
import com.project.web_be.entities.Role;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.InvalidParamException;
import com.project.web_be.repositories.RoleRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwtTokenUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public User register(UserDTO userDTO) throws Exception {
        String email = userDTO.getEmail();
        if(userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email already exists");
        }

        // Lấy role theo roleId, nếu không có thì mặc định STUDENT
        Role role = roleRepository.findById(userDTO.getRoleId() != null ? userDTO.getRoleId() : 1L)
                .orElseThrow(() -> new DataNotFoundException("Role not found"));

        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .email(userDTO.getEmail())
                .phoneNumber(null)
                .dob(null)
                .avatar(null)
                .gender(true)
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .role(role)
                .currentRole(role)
                .roles(new HashSet<>())
                .build();

        // Thêm role vào Set roles
        newUser.getRoles().add(role);

        return userRepository.save(newUser);
    }

    public User getStudentById(Long studentId) throws DataNotFoundException {
          return userRepository.findById(studentId)
                  .orElseThrow(()-> new DataNotFoundException("Student not found"));
    }
    
    @Override
    public String login(UserLoginDTO userLoginDTO) throws Exception {
        Optional<User> optionalUser = userRepository.findByEmail(userLoginDTO.getEmail());
        if(optionalUser.isEmpty()) {
            throw new DataNotFoundException("Email not found");
        }
        User existingUser = optionalUser.get();
        if(!passwordEncoder.matches(userLoginDTO.getPassword(), existingUser.getPassword())) {
                throw new BadCredentialsException("password not match");
        }

        // Set current role to default role if not set
        if (existingUser.getCurrentRole() == null) {
            existingUser.setCurrentRole(existingUser.getRole());
            userRepository.save(existingUser);
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userLoginDTO.getEmail(),
                userLoginDTO.getPassword(),
                existingUser.getAuthorities()
        );

        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtil.generateToken(existingUser);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng với id: "+id));
    }

    @Override
    @Transactional
    public String switchRole(String email, String newRoleName) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        
        // Kiểm tra user có role này không
        boolean hasRole = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(newRoleName));
        
        if (!hasRole) {
            throw new InvalidParamException("User does not have this role: " + newRoleName);
        }
        
        // Tìm role object
        Role newRole = roleRepository.findByName(newRoleName)
                .orElseThrow(() -> new DataNotFoundException("Role not found: " + newRoleName));
        
        user.setCurrentRole(newRole);
        userRepository.save(user);
        
        // Generate new token với role mới
        return jwtTokenUtil.generateToken(user);
    }

    @Override
    public String getCurrentRole(String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        return user.getCurrentRole() != null ? user.getCurrentRole().getName() : user.getRole().getName();
    }

    @Override
    public User getUserByEmail(String email) throws Exception {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public void addRoleToUser(String email, String roleName) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new DataNotFoundException("Role not found: " + roleName));
        
        if (user.getRoles().contains(role)) {
            throw new InvalidParamException("User already has this role");
        }
        
        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void removeRoleFromUser(String email, String roleName) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new DataNotFoundException("Role not found: " + roleName));
        
        if (!user.getRoles().contains(role)) {
            throw new InvalidParamException("User does not have this role");
        }
        
        // Không cho phép xóa role hiện tại nếu đó là role duy nhất
        if (user.getCurrentRole() != null && user.getCurrentRole().getName().equals(roleName) && user.getRoles().size() == 1) {
            throw new InvalidParamException("Cannot remove the only role from user");
        }
        
        user.getRoles().remove(role);
        
        // Nếu đang xóa role hiện tại, chuyển về role mặc định
        if (user.getCurrentRole() != null && user.getCurrentRole().getName().equals(roleName)) {
            user.setCurrentRole(user.getRole());
        }
        
        userRepository.save(user);
    }
}
