package com.project.web_be.controllers;

import com.project.web_be.dtos.CommentDTO;
import com.project.web_be.dtos.requests.CreateCommentDTO;
import com.project.web_be.dtos.requests.UpdateCommentDTO;
import com.project.web_be.exceptions.DataNotFoundException;
import com.project.web_be.exceptions.PermissionDenyException;
import com.project.web_be.services.CommentService;
import com.project.web_be.entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> createComment(@ModelAttribute CreateCommentDTO createCommentDTO) {
        try {
            Long userId = getCurrentUserId();
            CommentDTO comment = commentService.createComment(createCommentDTO, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo comment: "+e.getMessage());
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long commentId,
            @RequestBody UpdateCommentDTO updateCommentDTO) {
        try {
            Long userId = getCurrentUserId();
            CommentDTO comment = commentService.updateComment(commentId, updateCommentDTO, userId);
            return ResponseEntity.ok(comment);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (PermissionDenyException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            Long userId = getCurrentUserId();
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.noContent().build();
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (PermissionDenyException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long commentId) {
        try {
            CommentDTO comment = commentService.getCommentById(commentId);
            return ResponseEntity.ok(comment);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<Page<CommentDTO>> getParentCommentsByClassId(
            @PathVariable Long classId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentDTO> comments = commentService.getParentCommentsByClassId(classId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/class/{classId}/all")
    public ResponseEntity<List<CommentDTO>> getAllCommentsByClassId(@PathVariable Long classId) {
        List<CommentDTO> comments = commentService.getAllCommentsByClassId(classId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{parentCommentId}/replies")
    public ResponseEntity<List<CommentDTO>> getSubCommentsByParentId(@PathVariable Long parentCommentId) {
        List<CommentDTO> subComments = commentService.getSubCommentsByParentId(parentCommentId);
        return ResponseEntity.ok(subComments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<CommentDTO>> getCommentsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentDTO> comments = commentService.getCommentsByUserId(userId, pageable);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> likeComment(@PathVariable Long commentId) {
        try {
            Long userId = getCurrentUserId();
            commentService.likeComment(commentId, userId);
            return ResponseEntity.ok().build();
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long commentId) {
        try {
            Long userId = getCurrentUserId();
            commentService.unlikeComment(commentId, userId);
            return ResponseEntity.ok().build();
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{commentId}/likes")
    public ResponseEntity<Integer> getCommentLikes(@PathVariable Long commentId) {
        try {
            int likes = commentService.getCommentLikes(commentId);
            return ResponseEntity.ok(likes);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/comments/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/files/view/{filename:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/comments/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            return currentUser.getId();
        }
        return 1L;
    }
} 