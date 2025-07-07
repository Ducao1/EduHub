package com.project.web_be.services;

import com.project.web_be.dtos.ClassroomDTO;
import com.project.web_be.entities.Classroom;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ClassroomService {
    Classroom addClassroom(ClassroomDTO classroomDTO) throws Exception;
    Classroom getClassroomById(long id) throws Exception;
    List<Classroom> getAllClassrooms();
    Classroom updateClassroom(ClassroomDTO classroomDTO,long id) throws Exception;
    @Transactional
    Classroom updateClassCode(long id) throws Exception;
    List<Classroom> getClassByTeacherId(Long teacherId);
    void deleteClassroom(long id);
}
