package com.project.web_be.services.Impl;

import com.project.web_be.components.JwtTokenUtils;
import com.project.web_be.dtos.UserDTO;
import com.project.web_be.dtos.UserLoginDTO;
import com.project.web_be.dtos.UpdateUserDTO;
import com.project.web_be.dtos.responses.StudentTaskResponse;
import com.project.web_be.dtos.responses.StudentTaskByClassResponse;
import com.project.web_be.dtos.responses.StudentTaskWithStudentResponse;
import com.project.web_be.entities.Role;
import com.project.web_be.entities.User;
import com.project.web_be.entities.Assignment;
import com.project.web_be.entities.Exam;
import com.project.web_be.entities.Submission;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.ClassExam;
import com.project.web_be.entities.Score;
import com.project.web_be.entities.Classroom;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.InvalidParamException;
import com.project.web_be.repositories.RoleRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.repositories.EnrollmentRepository;
import com.project.web_be.repositories.SubmissionRepository;
import com.project.web_be.repositories.AssignmentRepository;
import com.project.web_be.repositories.ClassExamRepository;
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
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final EnrollmentRepository enrollmentRepository;
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassExamRepository classExamRepository;

    @Override
    @Transactional
    public User register(UserDTO userDTO) throws Exception {
        String email = userDTO.getEmail();
        if(userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email already exists");
        }
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
        Role newRole = roleRepository.findByName(newRoleName)
                .orElseThrow(() -> new DataNotFoundException("Role not found: " + newRoleName));
        boolean hasRole = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(newRoleName));
        if (!hasRole) {
            user.getRoles().add(newRole);
        }
        user.setCurrentRole(newRole);
        userRepository.save(user);
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
        if (user.getCurrentRole() != null && user.getCurrentRole().getName().equals(roleName) && user.getRoles().size() == 1) {
            throw new InvalidParamException("Cannot remove the only role from user");
        }
        user.getRoles().remove(role);
        if (user.getCurrentRole() != null && user.getCurrentRole().getName().equals(roleName)) {
            user.setCurrentRole(user.getRole());
        }
        
        userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserDTO dto) throws Exception {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getDob() != null) user.setDob(dto.getDob());

        MultipartFile avatar = dto.getAvatar();
        if (avatar != null && !avatar.isEmpty()) {
            String uploadDir = "uploads/avatars/";
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = id + "_" + avatar.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            avatar.transferTo(filePath);
            user.setAvatar("/" + uploadDir + fileName);
        }

        return userRepository.save(user);
    }

    @Override
    public StudentTaskWithStudentResponse getStudentTasksByClass(Long studentId) throws Exception {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new DataNotFoundException("Student not found"));
        List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                .filter(e -> e.getStudent().getId().equals(studentId))
                .collect(Collectors.toList());
        
        List<StudentTaskByClassResponse> classTasks = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Classroom classroom = enrollment.getClassroom();
            List<Assignment> assignments = assignmentRepository.findByClassroomId(classroom.getId(), null).getContent();
            List<StudentTaskResponse> assignmentTasks = new ArrayList<>();
            
            for (Assignment assignment : assignments) {
                Optional<Submission> submissionOpt = submissionRepository.findByStudentIdAndAssignmentIdWithScore(studentId, assignment.getId());
                
                StudentTaskResponse task = StudentTaskResponse.builder()
                        .id(assignment.getId())
                        .title(assignment.getTitle())
                        .type("ASSIGNMENT")
                        .assignedDate(assignment.getAssignedDate())
                        .dueDate(assignment.getDueDate())
                        .teacherName(assignment.getTeacher().getFullName())
                        .className(classroom.getName())
                        .isSubmitted(submissionOpt.isPresent())
                        .submittedAt(submissionOpt.map(Submission::getSubmittedAt).orElse(null))
                        .score(submissionOpt.flatMap(s -> {
                            if (s.getScore() != null) {
                                return Optional.of((double) s.getScore().getScore());
                            }
                            return Optional.empty();
                        }).orElse(null))
                        .status(determineStatus(assignment.getDueDate(), submissionOpt))
                        .build();
                
                assignmentTasks.add(task);
            }
            List<ClassExam> classExams = classExamRepository.findByClassroomId(classroom.getId(), null).getContent();
            List<StudentTaskResponse> examTasks = new ArrayList<>();
            
            for (ClassExam classExam : classExams) {
                List<Submission> submissions = submissionRepository.findByExamIdAndStudentIdWithScore(classExam.getExam().getId(), studentId);
                Optional<Submission> submissionOpt = submissions.stream()
                        .max((s1, s2) -> s1.getSubmittedAt().compareTo(s2.getSubmittedAt()));
                
                StudentTaskResponse task = StudentTaskResponse.builder()
                        .id(classExam.getExam().getId())
                        .title(classExam.getExam().getTitle())
                        .type("EXAM")
                        .assignedDate(classExam.getAssignedDate())
                        .dueDate(classExam.getDueDate())
                        .teacherName(classExam.getExam().getTeacher().getFullName())
                        .className(classroom.getName())
                        .isSubmitted(submissionOpt.isPresent())
                        .submittedAt(submissionOpt.map(Submission::getSubmittedAt).orElse(null))
                        .score(submissionOpt.flatMap(s -> {
                            if (s.getScore() != null) {
                                return Optional.of((double) s.getScore().getScore());
                            }
                            return Optional.empty();
                        }).orElse(null))
                        .status(determineStatus(classExam.getDueDate(), submissionOpt))
                        .build();
                
                examTasks.add(task);
            }
            StudentTaskByClassResponse.TaskSummary summary = calculateTaskSummary(assignmentTasks, examTasks);

            StudentTaskByClassResponse classTask = StudentTaskByClassResponse.builder()
                    .classId(classroom.getId())
                    .className(classroom.getName())
                    .teacherName(classroom.getTeacher() != null ? classroom.getTeacher().getFullName() : "N/A")
                    .assignments(assignmentTasks)
                    .exams(examTasks)
                    .summary(summary)
                    .build();

            classTasks.add(classTask);
        }
        StudentTaskWithStudentResponse.OverallSummary overallSummary = calculateOverallSummary(classTasks);

        return StudentTaskWithStudentResponse.builder()
                .studentId(student.getId())
                .studentName(student.getFullName())
                .studentEmail(student.getEmail())
                .classTasks(classTasks)
                .overallSummary(overallSummary)
                .build();
    }

    @Override
    public StudentTaskWithStudentResponse getStudentTasksInClass(Long studentId, Long classId) throws Exception {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new DataNotFoundException("Student not found"));
        boolean isEnrolled = enrollmentRepository.findAll().stream()
                .anyMatch(e -> e.getStudent().getId().equals(studentId) && e.getClassroom().getId().equals(classId));
        
        if (!isEnrolled) {
            throw new DataNotFoundException("Student is not enrolled in this class");
        }
        Classroom classroom = null;
        for (Enrollment enrollment : enrollmentRepository.findAll()) {
            if (enrollment.getStudent().getId().equals(studentId) && enrollment.getClassroom().getId().equals(classId)) {
                classroom = enrollment.getClassroom();
                break;
            }
        }

        if (classroom == null) {
            throw new DataNotFoundException("Class not found");
        }

        List<Assignment> assignments = assignmentRepository.findByClassroomId(classroom.getId(), null).getContent();
        List<StudentTaskResponse> assignmentTasks = new ArrayList<>();
        
        for (Assignment assignment : assignments) {
            Optional<Submission> submissionOpt = submissionRepository.findByStudentIdAndAssignmentIdWithScore(studentId, assignment.getId());
            
            StudentTaskResponse task = StudentTaskResponse.builder()
                    .id(assignment.getId())
                    .title(assignment.getTitle())
                    .type("ASSIGNMENT")
                    .assignedDate(assignment.getAssignedDate())
                    .dueDate(assignment.getDueDate())
                    .teacherName(assignment.getTeacher().getFullName())
                    .className(classroom.getName())
                    .isSubmitted(submissionOpt.isPresent())
                    .submittedAt(submissionOpt.map(Submission::getSubmittedAt).orElse(null))
                    .score(submissionOpt.flatMap(s -> {
                        if (s.getScore() != null) {
                            return Optional.of((double) s.getScore().getScore());
                        }
                        return Optional.empty();
                    }).orElse(null))
                    .status(determineStatus(assignment.getDueDate(), submissionOpt))
                    .build();
            
            assignmentTasks.add(task);
        }
        List<ClassExam> classExams = classExamRepository.findByClassroomId(classroom.getId(), null).getContent();
        List<StudentTaskResponse> examTasks = new ArrayList<>();
        
        for (ClassExam classExam : classExams) {
            List<Submission> submissions = submissionRepository.findByExamIdAndStudentIdWithScore(classExam.getExam().getId(), studentId);
            Optional<Submission> submissionOpt = submissions.stream()
                    .max((s1, s2) -> s1.getSubmittedAt().compareTo(s2.getSubmittedAt()));
            
            StudentTaskResponse task = StudentTaskResponse.builder()
                    .id(classExam.getExam().getId())
                    .title(classExam.getExam().getTitle())
                    .type("EXAM")
                    .assignedDate(classExam.getAssignedDate())
                    .dueDate(classExam.getDueDate())
                    .teacherName(classExam.getExam().getTeacher().getFullName())
                    .className(classroom.getName())
                    .isSubmitted(submissionOpt.isPresent())
                    .submittedAt(submissionOpt.map(Submission::getSubmittedAt).orElse(null))
                    .score(submissionOpt.flatMap(s -> {
                        if (s.getScore() != null) {
                            return Optional.of((double) s.getScore().getScore());
                        }
                        return Optional.empty();
                    }).orElse(null))
                    .status(determineStatus(classExam.getDueDate(), submissionOpt))
                    .build();
            
            examTasks.add(task);
        }
        StudentTaskByClassResponse.TaskSummary summary = calculateTaskSummary(assignmentTasks, examTasks);

        StudentTaskByClassResponse classTask = StudentTaskByClassResponse.builder()
                .classId(classroom.getId())
                .className(classroom.getName())
                .teacherName(classroom.getTeacher() != null ? classroom.getTeacher().getFullName() : "N/A")
                .assignments(assignmentTasks)
                .exams(examTasks)
                .summary(summary)
                .build();

        List<StudentTaskByClassResponse> classTasks = new ArrayList<>();
        classTasks.add(classTask);
        StudentTaskWithStudentResponse.OverallSummary overallSummary = calculateOverallSummary(classTasks);

        return StudentTaskWithStudentResponse.builder()
                .studentId(student.getId())
                .studentName(student.getFullName())
                .studentEmail(student.getEmail())
                .classTasks(classTasks)
                .overallSummary(overallSummary)
                .build();
    }

    private String determineStatus(LocalDateTime dueDate, Optional<Submission> submissionOpt) {
        if (submissionOpt.isEmpty()) {
            return "NOT_SUBMITTED";
        }
        
        Submission submission = submissionOpt.get();
        LocalDateTime submittedAt = submission.getSubmittedAt();
        
        if (dueDate != null && submittedAt.isAfter(dueDate)) {
            return "LATE";
        }
        
        if (submission.getScore() != null) {
            return "GRADED";
        }
        
        return "SUBMITTED";
    }

    private StudentTaskByClassResponse.TaskSummary calculateTaskSummary(List<StudentTaskResponse> assignments, List<StudentTaskResponse> exams) {
        int totalAssignments = assignments.size();
        int submittedAssignments = (int) assignments.stream().filter(StudentTaskResponse::isSubmitted).count();
        int gradedAssignments = (int) assignments.stream().filter(a -> a.getScore() != null).count();

        int totalExams = exams.size();
        int submittedExams = (int) exams.stream().filter(StudentTaskResponse::isSubmitted).count();
        int gradedExams = (int) exams.stream().filter(e -> e.getScore() != null).count();

        List<Double> allScores = new ArrayList<>();
        allScores.addAll(assignments.stream().map(StudentTaskResponse::getScore).filter(s -> s != null).collect(Collectors.toList()));
        allScores.addAll(exams.stream().map(StudentTaskResponse::getScore).filter(s -> s != null).collect(Collectors.toList()));
        
        double averageScore = allScores.isEmpty() ? 0.0 : allScores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        
        return StudentTaskByClassResponse.TaskSummary.builder()
                .totalAssignments(totalAssignments)
                .submittedAssignments(submittedAssignments)
                .gradedAssignments(gradedAssignments)
                .totalExams(totalExams)
                .submittedExams(submittedExams)
                .gradedExams(gradedExams)
                .averageScore(Math.round(averageScore * 100.0) / 100.0)
                .build();
    }

    private StudentTaskWithStudentResponse.OverallSummary calculateOverallSummary(List<StudentTaskByClassResponse> classTasks) {
        int totalClasses = classTasks.size();
        int totalAssignments = 0;
        int submittedAssignments = 0;
        int gradedAssignments = 0;
        int totalExams = 0;
        int submittedExams = 0;
        int gradedExams = 0;
        List<Double> allScores = new ArrayList<>();

        for (StudentTaskByClassResponse classTask : classTasks) {
            StudentTaskByClassResponse.TaskSummary summary = classTask.getSummary();
            totalAssignments += summary.getTotalAssignments();
            submittedAssignments += summary.getSubmittedAssignments();
            gradedAssignments += summary.getGradedAssignments();
            totalExams += summary.getTotalExams();
            submittedExams += summary.getSubmittedExams();
            gradedExams += summary.getGradedExams();

            classTask.getAssignments().stream()
                    .map(StudentTaskResponse::getScore)
                    .filter(s -> s != null)
                    .forEach(allScores::add);
            
            classTask.getExams().stream()
                    .map(StudentTaskResponse::getScore)
                    .filter(s -> s != null)
                    .forEach(allScores::add);
        }

        double overallAverageScore = allScores.isEmpty() ? 0.0 : allScores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        return StudentTaskWithStudentResponse.OverallSummary.builder()
                .totalClasses(totalClasses)
                .totalAssignments(totalAssignments)
                .submittedAssignments(submittedAssignments)
                .gradedAssignments(gradedAssignments)
                .totalExams(totalExams)
                .submittedExams(submittedExams)
                .gradedExams(gradedExams)
                .overallAverageScore(Math.round(overallAverageScore * 100.0) / 100.0)
                .build();
    }
}
