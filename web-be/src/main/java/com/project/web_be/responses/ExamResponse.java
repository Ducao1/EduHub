package com.project.web_be.responses;

import com.project.web_be.entities.Exam;
import com.project.web_be.entities.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class ExamResponse {
    private Long id;
    private String title;
    private String teacher;
    private Long duration;
    private List<Question> question;

    public static ExamResponse fromExam(Exam exam){
        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .teacher(exam.getTeacher().getFullName())
                .duration(exam.getDuration())
                .question(exam.getQuestions())
                .build();
    }
}
