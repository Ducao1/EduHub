package com.project.web_be.services.Impl;

import com.project.web_be.dtos.SubmissionAnswerDTO;
import com.project.web_be.dtos.SubmissionExamDTO;
import com.project.web_be.entities.*;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.*;
import com.project.web_be.services.EnrollmentService;
import com.project.web_be.services.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class SubmissionServiceImpl implements SubmissionService {
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentService enrollmentService;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final AttachmentRepository attachmentRepository;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String UPLOAD_DIR = "uploads/";
    
    public boolean isValidFileType(String contentType) {
        return contentType != null && (contentType.startsWith("image/") ||
                contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("application/vnd.ms-excel") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    }

    public Submission saveSubmission(Long assignmentId, Long studentId, MultipartFile file) throws DataNotFoundException, IOException {
        Assignment existingAssignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new DataNotFoundException("Assignment not found"));
        User existingStudent = userRepository.findById(studentId)
                .orElseThrow(() -> new DataNotFoundException("Student not found"));

        // Tạo submission trước
        Submission submission = new Submission();
        submission.setAssignment(existingAssignment);
        submission.setStudent(existingStudent);
        submission.setSubmittedAt(LocalDateTime.now());
        
        // Lưu submission để có ID
        Submission savedSubmission = submissionRepository.save(submission);

        // Tạo attachment cho submission
        createAttachmentForSubmission(file, savedSubmission);

        return savedSubmission;
    }

    private void createAttachmentForSubmission(MultipartFile file, Submission submission) throws IOException {
        if (!isValidFileType(file.getContentType())) {
            throw new IOException("Định dạng file không hợp lệ: " + file.getOriginalFilename());
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IOException("File quá lớn: " + file.getOriginalFilename());
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Tạo attachment entity
        Attachment attachment = Attachment.builder()
                .fileName(fileName)
                .filePath(UPLOAD_DIR + fileName)
                .submission(submission)
                .build();

        attachmentRepository.save(attachment);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    public boolean hasSubmitted(Long userId, Long assignmentId) {
        return submissionRepository.existsByStudentIdAndAssignmentId(userId, assignmentId);
    }

    @Override
    @Transactional
    public boolean cancelSubmission(Long userId, Long assignmentId) {
        Optional<Submission> submissionOpt = submissionRepository.findByStudentIdAndAssignmentId(userId, assignmentId);
        if (submissionOpt.isPresent()) {
            Submission submission = submissionOpt.get();
            // Xóa file vật lý nếu cần
            if (submission.getAttachments() != null) {
                for (Attachment att : submission.getAttachments()) {
                    try {
                        Files.deleteIfExists(Paths.get(att.getFilePath()));
                    } catch (IOException e) {
                        // log error nếu cần
                    }
                }
            }
            submissionRepository.delete(submission);
            return true;
        }
        return false;
    }

    @Override
    public Submission getSubmissionByStudentAndAssignment(Long userId, Long assignmentId) throws DataNotFoundException {
        return submissionRepository.findByStudentIdAndAssignmentId(userId, assignmentId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bài nộp"));
    }

    public List<Map<String, Object>> getClassSubmissionStatus(Long classId, Long assignmentId) {
        List<User> students = enrollmentService.getStudentsByClassId(classId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (User student : students) {
            boolean hasSubmitted = submissionRepository.existsByStudentIdAndAssignmentId(student.getId(), assignmentId);

            Map<String, Object> studentStatus = new HashMap<>();
            studentStatus.put("studentId", student.getId());
            studentStatus.put("fullName", student.getFullName());
            studentStatus.put("submitted", hasSubmitted);

            response.add(studentStatus);
        }

        return response;
    }

    @Override
    public Submission submitExam(SubmissionExamDTO submissionExamDTO) throws Exception {
        Exam exam = examRepository.findById(submissionExamDTO.getExamId())
                .orElseThrow(() -> new DataNotFoundException("Exam not found"));

        User student = userRepository.findById(submissionExamDTO.getStudentId())
                .orElseThrow(() -> new DataNotFoundException("Student not found"));

        Submission submission = Submission.builder()
                .exam(exam)
                .student(student)
                .submittedAt(LocalDateTime.now())
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        List<SubmissionAnswer> submissionAnswers = new ArrayList<>();
        Map<Long, List<Answer>> submittedAnswersMap = new HashMap<>();

        for (SubmissionAnswerDTO submissionAnswerDTO : submissionExamDTO.getAnswers()) {
            Question question = questionRepository.findById(submissionAnswerDTO.getQuestionId())
                    .orElseThrow(() -> new DataNotFoundException("Question not found"));
            Answer answer = answerRepository.findById(submissionAnswerDTO.getAnswerId())
                    .orElseThrow(() -> new DataNotFoundException("Answer not found"));

            submittedAnswersMap.computeIfAbsent(question.getId(), k -> new ArrayList<>()).add(answer);
            SubmissionAnswer submissionAnswer = SubmissionAnswer.builder()
                    .submission(savedSubmission)
                    .question(question)
                    .answer(answer)
                    .build();

            submissionAnswers.add(submissionAnswer);
        }

        List<SubmissionAnswer> savedAnswers = submissionAnswerRepository.saveAll(submissionAnswers);
        savedSubmission.setSubmissionAnswers(savedAnswers);

        float totalScore = 0f;

        for (Question question : exam.getQuestions()) {
            List<Answer> correctAnswers = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .toList();

            List<Answer> submittedAnswers = submittedAnswersMap.getOrDefault(question.getId(), new ArrayList<>());

            if (question.getType().name().equals("SINGLE_CHOICE")) {
                if (submittedAnswers.size() == 1 && correctAnswers.contains(submittedAnswers.get(0))) {
                    totalScore += question.getPoint();
                }
            } else if (question.getType().name().equals("MULTI_CHOICE")) {
                List<Long> correctIds = correctAnswers.stream().map(Answer::getId).toList();
                List<Long> submittedIds = submittedAnswers.stream().map(Answer::getId).toList();
                System.out.println("correct:" + correctIds);
                System.out.println("submitted: "+submittedIds);
                boolean isCorrect = submittedIds.containsAll(correctIds) && correctIds.containsAll(submittedIds);

                if (isCorrect) {
                    totalScore += question.getPoint();
                    System.out.println("score:"+ totalScore);
                }
            }
        }

        Score score = Score.builder()
                .score(totalScore)
                .submission(savedSubmission)
                .build();

        savedSubmission.setScore(score);

        return savedSubmission;
    }

    public List<Submission> getStudentSubmissions(Long examId, Long studentId) {
        return submissionRepository.findByExamIdAndStudentId(examId, studentId);
    }

    public List<Submission> getExamSubmissions(Long examId) {
        return submissionRepository.findByExamId(examId);
    }

    public Submission getSubmissionById(Long submissionId) throws DataNotFoundException {
        return submissionRepository.findById(submissionId)
                .orElseThrow(() -> new DataNotFoundException("Submission not found"));
    }
}
