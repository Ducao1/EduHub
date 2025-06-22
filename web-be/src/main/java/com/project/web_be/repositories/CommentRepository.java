package com.project.web_be.repositories;

import com.project.web_be.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    @Query("SELECT c FROM Comment c WHERE c.classId = :classId AND c.parentComment IS NULL ORDER BY c.createdAt DESC")
    Page<Comment> findParentCommentsByClassId(@Param("classId") Long classId, Pageable pageable);
    
    @Query("SELECT c FROM Comment c WHERE c.classId = :classId ORDER BY c.createdAt DESC")
    List<Comment> findAllCommentsByClassId(@Param("classId") Long classId);
    
    @Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentCommentId ORDER BY c.createdAt ASC")
    List<Comment> findSubCommentsByParentId(@Param("parentCommentId") Long parentCommentId);
    
    @Query("SELECT c FROM Comment c WHERE c.user.id = :userId ORDER BY c.createdAt DESC")
    Page<Comment> findCommentsByUserId(@Param("userId") Long userId, Pageable pageable);
    
    boolean existsByClassIdAndUserId(Long classId, Long userId);
} 