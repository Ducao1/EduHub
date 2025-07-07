package com.project.web_be.controllers;

import com.project.web_be.dtos.SwitchRoleDTO;
import com.project.web_be.dtos.UserDTO;
import com.project.web_be.dtos.UserLoginDTO;
import com.project.web_be.dtos.UserRolesDTO;
import com.project.web_be.dtos.UpdateUserDTO;
import com.project.web_be.dtos.requests.ChangePasswordDTO;
import com.project.web_be.dtos.responses.StudentTaskWithStudentResponse;
import com.project.web_be.entities.Role;
import com.project.web_be.entities.Submission;
import com.project.web_be.entities.User;
import com.project.web_be.repositories.RoleRepository;
import com.project.web_be.services.Impl.UserServiceImpl;
import com.project.web_be.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;
    private final RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO){
        try {
            User user = userService.register(userDTO);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO) throws Exception {
        try {
            String token = userService.login(userLoginDTO);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable long id){
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable long id){
        try {
            User student = userService.getStudentById(id);
            return ResponseEntity.ok(student);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/available-roles")
    public ResponseEntity<?> getAvailableRoles() {
        try {
            List<Role> roles = roleRepository.findAll();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/switch-role")
    public ResponseEntity<?> switchRole(@RequestBody SwitchRoleDTO switchRoleDTO) {
        try {
            String newToken = userService.switchRole(switchRoleDTO.getEmail(), switchRoleDTO.getNewRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", newToken);
            response.put("currentRole", switchRoleDTO.getNewRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/current-role")
    public ResponseEntity<?> getCurrentRole(@RequestParam String email) {
        try {
            String currentRole = userService.getCurrentRole(email);
            Map<String, String> response = new HashMap<>();
            response.put("currentRole", currentRole);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/roles")
    public ResponseEntity<?> getUserRoles(@RequestParam String email) {
        try {
            User user = userService.getUserByEmail(email);
            String currentRole = userService.getCurrentRole(email);
            List<String> allRoles = user.getRoles().stream()
                    .map(role -> role.getName())
                    .toList();
            
            UserRolesDTO userRolesDTO = UserRolesDTO.builder()
                    .email(email)
                    .currentRole(currentRole)
                    .allRoles(allRoles)
                    .build();
            
            return ResponseEntity.ok(userRolesDTO);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/add-role")
    public ResponseEntity<?> addRoleToUser(@RequestParam String email, @RequestParam String roleName) {
        try {
            userService.addRoleToUser(email, roleName);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Role added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/remove-role")
    public ResponseEntity<?> removeRoleFromUser(@RequestParam String email, @RequestParam String roleName) {
        try {
            userService.removeRoleFromUser(email, roleName);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Role removed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
        @PathVariable Long id,
        @ModelAttribute UpdateUserDTO updateUserDTO
    ) {
        try {
            User updatedUser = userService.updateUser(id, updateUserDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto) {
        try {
            userService.changePassword(dto.getUserId(), dto.getOldPassword(), dto.getNewPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đổi mật khẩu thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{studentId}/tasks/by-class")
    public ResponseEntity<?> getStudentTasksByClass(@PathVariable Long studentId) {
        try {
            StudentTaskWithStudentResponse response = userService.getStudentTasksByClass(studentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{studentId}/tasks/class/{classId}")
    public ResponseEntity<?> getStudentTasksInClass(@PathVariable Long studentId, @PathVariable Long classId) {
        try {
            StudentTaskWithStudentResponse response = userService.getStudentTasksInClass(studentId, classId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
