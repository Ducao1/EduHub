package com.project.web_be.services.Impl;

import com.project.web_be.dtos.responses.StudentScoreResponse;
import com.project.web_be.entities.Score;
import com.project.web_be.entities.Submission;
import com.project.web_be.entities.User;
import com.project.web_be.repositories.ScoreRepository;
import com.project.web_be.repositories.SubmissionAnswerRepository;
import com.project.web_be.repositories.SubmissionRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.ScoreService;
import com.project.web_be.dtos.ScoreDTO;
import com.project.web_be.dtos.responses.ScoreAssignmentResponse;
import com.project.web_be.dtos.ListStudentScoreDTO;
import com.project.web_be.entities.Enrollment;
import com.project.web_be.entities.Assignment;
import com.project.web_be.entities.ClassExam;
import com.project.web_be.entities.Exam;
import com.project.web_be.repositories.EnrollmentRepository;
import com.project.web_be.repositories.AssignmentRepository;
import com.project.web_be.repositories.ClassExamRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ScoreServiceImpl implements ScoreService {
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassExamRepository classExamRepository;
    private final ScoreRepository scoreRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public Score autoGradeSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));

        float totalScore = (float) submission.getSubmissionAnswers()
                .stream()
                .filter(a -> a.getAnswer().isCorrect())
                .count();

        if (scoreRepository.existsBySubmissionId(submissionId)) {
            throw new IllegalArgumentException("Bài nộp này đã có điểm!");
        }
        Score score = Score.builder()
                .score(totalScore)
                .submission(submission)
                .gradedBy(null)
                .build();

        return scoreRepository.save(score);
    }

    public Score manualGradeSubmission(Long submissionId, Long teacherId, float totalScore) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));


        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        Score score = scoreRepository.findBySubmissionId(submissionId).orElse(null);
        if (score == null) {
            score = Score.builder()
                    .score(totalScore)
                    .gradedBy(teacher)
                    .submission(submission)
                    .build();
        } else {
            score.setScore(totalScore);
            score.setGradedBy(teacher);
        }

        return scoreRepository.save(score);
    }

    public Score gradeSubmission(ScoreDTO scoreDTO) {
        Submission submission = submissionRepository.findById(scoreDTO.getSubmissionId())
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));
        User teacher = userRepository.findById(scoreDTO.getGradedById())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));
        Score score = scoreRepository.findBySubmissionId(scoreDTO.getSubmissionId()).orElse(null);
        if (score == null) {
            score = Score.builder()
                    .score(scoreDTO.getTotalScore())
                    .gradedBy(teacher)
                    .submission(submission)
                    .build();
        } else {
            score.setScore(scoreDTO.getTotalScore());
            score.setGradedBy(teacher);
        }
        return scoreRepository.save(score);
    }

    @Override
    public Score getScoreBySubmissionId(Long submissionId) {
        return scoreRepository.findBySubmissionId(submissionId).orElse(null);
    }

    @Override
    public List<ScoreAssignmentResponse> getScoresByAssignmentId(Long assignmentId) {
        List<Score> scores = scoreRepository.findAllBySubmission_Assignment_Id(assignmentId);
        List<ScoreAssignmentResponse> result = new ArrayList<>();
        for (Score score : scores) {
            if (score.getSubmission() != null && score.getSubmission().getStudent() != null) {
                result.add(ScoreAssignmentResponse.builder()
                        .scoreId(score.getId())
                        .score(score.getScore())
                        .studentId(score.getSubmission().getStudent().getId())
                        .studentName(score.getSubmission().getStudent().getFullName())
                        .studentEmail(score.getSubmission().getStudent().getEmail())
                        .build());
            }
        }
        return result;
    }

    @Override
    public List<ScoreDTO> getScoresByExamId(Long examId) {
        List<Score> scores = scoreRepository.findAllBySubmission_Exam_Id(examId);
        List<ScoreDTO> result = new ArrayList<>();
        for (Score score : scores) {
            if (score.getSubmission() != null && score.getSubmission().getStudent() != null) {
                result.add(new ScoreDTO(
                    score.getSubmission().getId(),
                    score.getSubmission().getStudent().getFullName(),
                    score.getScore(),
                    score.getSubmission().getSubmittedAt()
                ));
            }
        }
        return result;
    }

    @Override
    public List<StudentScoreResponse> getExamScoresByStudentId(Long studentId) {
        List<Score> scores = scoreRepository.findAll();
        List<StudentScoreResponse> result = new ArrayList<>();
        for (Score score : scores) {
            if (score.getSubmission() != null && score.getSubmission().getStudent() != null
                    && score.getSubmission().getStudent().getId().equals(studentId)
                    && score.getSubmission().getExam() != null) {
                String title = score.getSubmission().getExam().getTitle();
                result.add(new StudentScoreResponse(title, score.getScore()));
            }
        }
        return result;
    }

    @Override
    public List<StudentScoreResponse> getAssignmentScoresByStudentId(Long studentId) {
        List<Score> scores = scoreRepository.findAll();
        List<StudentScoreResponse> result = new ArrayList<>();
        for (Score score : scores) {
            if (score.getSubmission() != null && score.getSubmission().getStudent() != null
                    && score.getSubmission().getStudent().getId().equals(studentId)
                    && score.getSubmission().getAssignment() != null) {
                String title = score.getSubmission().getAssignment().getTitle();
                result.add(new StudentScoreResponse(title, score.getScore()));
            }
        }
        return result;
    }

    @Override
    public List<ListStudentScoreDTO> getStudentScoresByClassId(Long classId) {
        List<Enrollment> enrollments = enrollmentRepository.findByClassroomIdAndConfirmTrue(classId);
        List<Assignment> assignments = assignmentRepository.findByClassroomId(classId);
        List<ClassExam> classExams = classExamRepository.findByClassroomId(classId);
        List<ListStudentScoreDTO> result = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            User student = enrollment.getStudent();
            List<ListStudentScoreDTO.SubmissionScoreDTO> submissions = new ArrayList<>();
            // Bài tập
            for (Assignment assignment : assignments) {
                List<Float> scores = scoreRepository.findScoresByAssignmentIdAndStudentId(assignment.getId(), student.getId());
                Float score = scores.isEmpty() ? 0f : scores.get(0);
                submissions.add(ListStudentScoreDTO.SubmissionScoreDTO.builder()
                        .type("ASSIGNMENT")
                        .id(assignment.getId())
                        .title(assignment.getTitle())
                        .score(score)
                        .build());
            }
            // Bài thi
            for (ClassExam classExam : classExams) {
                Exam exam = classExam.getExam();
                List<Float> examScores = scoreRepository.findScoresByExamIdAndStudentId(exam.getId(), student.getId());
                Float examScore = examScores.isEmpty() ? 0f : examScores.get(0);
                submissions.add(ListStudentScoreDTO.SubmissionScoreDTO.builder()
                        .type("EXAM")
                        .id(exam.getId())
                        .title(exam.getTitle())
                        .score(examScore)
                        .build());
            }
            result.add(ListStudentScoreDTO.builder()
                    .studentId(student.getId())
                    .studentName(student.getFullName())
                    .submissions(submissions)
                    .build());
        }
        return result;
    }
}
