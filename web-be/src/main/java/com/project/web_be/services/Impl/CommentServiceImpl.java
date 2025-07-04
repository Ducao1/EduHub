package com.project.web_be.services.Impl;

import com.project.web_be.dtos.AttachmentDTO;
import com.project.web_be.dtos.CommentDTO;
import com.project.web_be.dtos.requests.CreateCommentDTO;
import com.project.web_be.dtos.requests.UpdateCommentDTO;
import com.project.web_be.entities.Attachment;
import com.project.web_be.entities.Comment;
import com.project.web_be.entities.User;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.PermissionDenyException;
import com.project.web_be.repositories.AttachmentRepository;
import com.project.web_be.repositories.CommentRepository;
import com.project.web_be.repositories.UserRepository;
import com.project.web_be.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final AttachmentRepository attachmentRepository;
    
    private static final String UPLOAD_DIR = "uploads/comments/";

    @Override
    @Transactional
    public CommentDTO createComment(CreateCommentDTO createCommentDTO, Long userId) throws DataNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        
        Comment parentComment = null;
        if (createCommentDTO.getParentCommentId() != null) {
            parentComment = commentRepository.findById(createCommentDTO.getParentCommentId())
                    .orElseThrow(() -> new DataNotFoundException("Parent comment not found"));
        }
        
        Comment comment = Comment.builder()
                .user(user)
                .content(createCommentDTO.getContent())
                .classId(createCommentDTO.getClassId())
                .parentComment(parentComment)
                .likes(0)
                .subComments(new ArrayList<>())
                .attachments(new ArrayList<>())
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        if (createCommentDTO.getFiles() != null && !createCommentDTO.getFiles().isEmpty()) {
            List<Attachment> attachments = new ArrayList<>();
            for (MultipartFile file : createCommentDTO.getFiles()) {
                if (!file.isEmpty()) {
                    try {
                        Attachment attachment = saveFile(file, savedComment);
                        attachments.add(attachment);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
                    }
                }
            }
            savedComment.setAttachments(attachments);
            savedComment = commentRepository.save(savedComment);
        }
        
        return convertToDTO(savedComment);
    }

    private Attachment saveFile(MultipartFile file, Comment comment) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        Attachment attachment = Attachment.builder()
                .fileName(originalFilename)
                .filePath(filePath.toString())
                .comment(comment)
                .build();
        return attachmentRepository.save(attachment);
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long commentId, UpdateCommentDTO updateCommentDTO, Long userId) throws DataNotFoundException, PermissionDenyException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new PermissionDenyException("You can only update your own comments");
        }
        
        if (updateCommentDTO.getContent() != null && !updateCommentDTO.getContent().trim().isEmpty()) {
            comment.setContent(updateCommentDTO.getContent());
        }
        
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) throws DataNotFoundException, PermissionDenyException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new PermissionDenyException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentDTO getCommentById(Long commentId) throws DataNotFoundException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        return convertToDTO(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentDTO> getParentCommentsByClassId(Long classId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findParentCommentsByClassId(classId, pageable);
        return comments.map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getAllCommentsByClassId(Long classId) {
        List<Comment> comments = commentRepository.findAllCommentsByClassId(classId);
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getSubCommentsByParentId(Long parentCommentId) {
        List<Comment> subComments = commentRepository.findSubCommentsByParentId(parentCommentId);
        return subComments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentDTO> getCommentsByUserId(Long userId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findCommentsByUserId(userId, pageable);
        return comments.map(this::convertToDTO);
    }

    @Override
    @Transactional
    public void likeComment(Long commentId, Long userId) throws DataNotFoundException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        
        comment.setLikes(comment.getLikes() + 1);
        commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void unlikeComment(Long commentId, Long userId) throws DataNotFoundException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        
        if (comment.getLikes() > 0) {
            comment.setLikes(comment.getLikes() - 1);
            commentRepository.save(comment);
        }
    }

    private CommentDTO convertToDTO(Comment comment) {
        List<CommentDTO> subComments = comment.getSubComments() != null ?
                comment.getSubComments().stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList()) : new ArrayList<>();
        
        List<AttachmentDTO> attachments = comment.getAttachments() != null ?
                comment.getAttachments().stream()
                        .map(attachment -> AttachmentDTO.builder()
                                .id(attachment.getId())
                                .fileName(attachment.getFileName())
                                .filePath(attachment.getFilePath())
                                .commentId(attachment.getComment() != null ? attachment.getComment().getId() : null)
                                .createdAt(attachment.getCreatedAt())
                                .updatedAt(attachment.getUpdatedAt())
                                .build())
                        .collect(Collectors.toList()) : new ArrayList<>();
        
        return CommentDTO.builder()
                .id(comment.getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getFullName())
                .content(comment.getContent())
                .classId(comment.getClassId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .likes(comment.getLikes())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .subComments(subComments)
                .attachments(attachments)
                .build();
    }
} 