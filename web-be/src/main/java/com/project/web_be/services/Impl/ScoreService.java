package com.project.web_be.services.Impl;

import com.project.web_be.entities.Score;
import com.project.web_be.entities.Submission;
import com.project.web_be.entities.User;
import com.project.web_be.enums.SubmissionType;
import com.project.web_be.repositories.ScoreRepository;
import com.project.web_be.repositories.SubmissionAnswerRepository;
import com.project.web_be.repositories.SubmissionRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.IScoreService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ScoreService implements IScoreService {
    private final ScoreRepository scoreRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository submissionAnswerRepository;
    private final UserRepository userRepository;

    public Score autoGradeSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));

        float totalScore = (float) submissionAnswerRepository.findBySubmissionId(submissionId)
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
}
