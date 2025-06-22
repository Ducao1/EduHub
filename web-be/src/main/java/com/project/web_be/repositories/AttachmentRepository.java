package com.project.web_be.repositories;

import com.project.web_be.entities.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    @Query("SELECT a FROM Attachment a WHERE a.submission.id = :submissionId")
    List<Attachment> findBySubmissionId(@Param("submissionId") Long submissionId);

    @Query("SELECT a FROM Attachment a WHERE a.comment.id = :commentId")
    List<Attachment> findByCommentId(@Param("commentId") Long commentId);

    @Query("SELECT a FROM Attachment a WHERE a.fileName = :fileName")
    Attachment findByFileName(@Param("fileName") String fileName);
} 