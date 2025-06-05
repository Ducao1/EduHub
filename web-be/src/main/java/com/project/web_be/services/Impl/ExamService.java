package com.project.web_be.services.Impl;

import com.project.web_be.dtos.ExamDTO;
import com.project.web_be.entities.Exam;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.repositories.ExamRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.IExamService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ExamService implements IExamService {
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    @Override
    public Exam addExam(ExamDTO examDTO) throws Exception {
        User teacher = userRepository.findById(examDTO.getTeacherId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher doesn't exist"));
        if (!teacher.getRole().getName().equals("TEACHER")){
            throw new DataNotFoundException("Role is not teacher");
        }

        Exam newExam = Exam.builder()
                .title(examDTO.getTitle())
                .duration(TimeUnit.MINUTES.toMillis(examDTO.getDuration()))
                .teacher(teacher).build();

        return examRepository.save(newExam);
    }

    @Override
    public Exam getExamById(long id) throws Exception {
        Optional<Exam> optionalExam = examRepository.findById(id);
        if (optionalExam.isPresent()){
            return optionalExam.get();
        }
        throw new DataNotFoundException("Cannot find assignment with id: "+id);
    }

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public Page<Exam> getAllExamsByTeacherId(long teacherId, Pageable pageable){
        return examRepository.findByTeacherId(teacherId, pageable);
    }

    @Override
    @Transactional
    public Exam updateExam(ExamDTO examDTO, long id) throws Exception {
        Exam existingExam = getExamById(id);
        if (existingExam!=null){
            existingExam.setTitle(examDTO.getTitle());
            existingExam.setTeacher(existingExam.getTeacher());
        }
        return examRepository.save(existingExam);
    }

    @Override
    @Transactional
    public void deleteExam(long id) {
        examRepository.deleteById(id);
    }
}
