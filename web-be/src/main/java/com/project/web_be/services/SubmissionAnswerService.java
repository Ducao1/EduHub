package com.project.web_be.services;

import com.project.web_be.dtos.SubmissionAnswerDTO;
import com.project.web_be.entities.SubmissionAnswer;

public interface SubmissionAnswerService {
    SubmissionAnswer submissionAnswer(SubmissionAnswerDTO submissionAnswerDTO) throws Exception;
}
