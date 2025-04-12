package com.project.web_be.services;

import com.project.web_be.dtos.SubmissionExamDTO;
import com.project.web_be.entities.Submission;

public interface ISubmissionService {
    Submission submitExam(SubmissionExamDTO submissionExamDTO) throws Exception;
}
