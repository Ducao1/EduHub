package com.project.web_be.services;

import com.project.web_be.dtos.CommentDTO;
import com.project.web_be.dtos.requests.CreateCommentDTO;
import com.project.web_be.dtos.requests.UpdateCommentDTO;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.PermissionDenyException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(CreateCommentDTO createCommentDTO, Long userId) throws DataNotFoundException;
    CommentDTO updateComment(Long commentId, UpdateCommentDTO updateCommentDTO, Long userId) throws DataNotFoundException, PermissionDenyException;
    void deleteComment(Long commentId, Long userId) throws DataNotFoundException, PermissionDenyException;
    CommentDTO getCommentById(Long commentId) throws DataNotFoundException;
    Page<CommentDTO> getParentCommentsByClassId(Long classId, Pageable pageable);
    List<CommentDTO> getAllCommentsByClassId(Long classId);
    List<CommentDTO> getSubCommentsByParentId(Long parentCommentId);
    Page<CommentDTO> getCommentsByUserId(Long userId, Pageable pageable);
    void likeComment(Long commentId, Long userId) throws DataNotFoundException;
    void unlikeComment(Long commentId, Long userId) throws DataNotFoundException;
} 