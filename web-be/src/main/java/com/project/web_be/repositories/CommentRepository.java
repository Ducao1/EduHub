package com.project.web_be.repositories;

import com.project.web_be.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentCommentId")
    List<Comment> findByParentCommentId(@Param("parentCommentId") Long parentCommentId);

    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId")
    List<Comment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Comment c WHERE c.parentComment IS NULL")
    List<Comment> findTopLevelComments();
} 