package com.project.web_be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "attachments",
        indexes = {
                @Index(name = "idx_attachment_submission_id", columnList = "submission_id"),
                @Index(name = "idx_attachment_comment_id", columnList = "comment_id"),
                @Index(name = "idx_attachment_assignment_id", columnList = "assignment_id"),
                @Index(name = "idx_attachment_file_name", columnList = "file_name")
        })
public class Attachment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", foreignKey = @ForeignKey(name = "fk_attachment_assignment"))
    @JsonBackReference("assignment-attachments")
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", foreignKey = @ForeignKey(name = "fk_attachment_submission"))
    @JsonBackReference("submission-attachments")
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", foreignKey = @ForeignKey(name = "fk_attachment_comment"))
    @JsonBackReference("comment-attachments")
    private Comment comment;
} 