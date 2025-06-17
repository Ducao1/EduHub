package com.project.web_be.services;

import com.project.web_be.dtos.SubmissionExamDTO;
import com.project.web_be.entities.Submission;

public interface SubmissionService {
    Submission submitExam(SubmissionExamDTO submissionExamDTO) throws Exception;
}
