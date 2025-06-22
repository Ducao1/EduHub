import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { Comment as IComment } from '../../../../interfaces/comment';
import { CommentService } from '../../../../services/comment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentNavBarComponent } from '../../student-nav-bar/student-nav-bar.component';
import { UserService } from '../../../../services/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-detail-student-class',
  standalone: true,
  imports: [
    CommonModule,
    StudentNavBarComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './detail-student-class.component.html',
  styleUrls: ['./detail-student-class.component.scss'],
  providers: [DatePipe]
})
export class DetailStudentClassComponent implements OnInit {
  classId!: number;
  className: string = 'Lớp Học Mẫu';
  classDescription: string = 'Mô tả lớp học mẫu cho sinh viên.';
  newPostContent: string = '';
  commentContent: string = '';
  selectedFile: File | null = null;
  commentSelectedFile: File | null = null;
  
  // Comment related properties
  comments: IComment[] = [];
  currentUserId: number | null = null;
  replyingTo: number | null = null;
  replyContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private commentService: CommentService,
    private userService: UserService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.userService.getUserId();
    this.loadClassInfo();
    this.loadComments();
  }

  loadClassInfo() {
    this.classroomService.getClassById(this.classId).subscribe({
      next: (response) => {
        this.className = response.name;
        this.classDescription = response.description || 'Không có mô tả.';
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin lớp:', err);
      }
    });
  }

  loadComments() {
    this.commentService.getAllCommentsByClassId(this.classId).subscribe({
      next: (allComments) => {
        // Filter for top-level comments only
        this.comments = allComments
          .filter(comment => !comment.parentCommentId)
          .sort((a: IComment, b: IComment) => {
            const dateA = Array.isArray(a.createdAt)
              ? new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5])
              : new Date(a.createdAt);
            const dateB = Array.isArray(b.createdAt)
              ? new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5])
              : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
      },
      error: (err) => {
        console.error('Lỗi khi tải comments:', err);
      }
    });
  }

  postNewContent() {
    console.log('Posting new content:', this.newPostContent);
    if (this.selectedFile) {
      console.log('Attached file:', this.selectedFile.name);
    }
    this.newPostContent = '';
    this.selectedFile = null; // Reset file after posting
  }

  postComment() {
    console.log('Posting comment:', this.commentContent);
    if (this.commentSelectedFile) {
      console.log('Attached file:', this.commentSelectedFile.name);
    }
    this.commentContent = '';
    this.commentSelectedFile = null; // Reset file after posting
  }

  // New comment functionality
  postNewComment(parentId: number | null = null): void {
    const content = parentId ? this.replyContent : this.commentContent;
    if (!this.classId || !content.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('classId', this.classId.toString());
    if (parentId) {
      formData.append('parentCommentId', parentId.toString());
    }

    if (!parentId && this.commentSelectedFile) {
      formData.append('files', this.commentSelectedFile, this.commentSelectedFile.name);
    }

    this.commentService.createComment(formData).subscribe({
      next: () => {
        this.loadComments();
        if (parentId) {
          this.replyingTo = null;
          this.replyContent = '';
        } else {
          this.commentContent = '';
          this.commentSelectedFile = null;
        }
      },
      error: (err) => console.error('Error posting comment', err)
    });
  }

  handleDeleteComment(commentId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => this.loadComments(),
        error: (err) => alert(`Không thể xóa bình luận: ${err.error?.message || err.message}`)
      });
    }
  }

  getAttachmentUrl(filePath: string): string {
    const filename = filePath.split(/[\\/]/).pop();
    return `${environment.apiBaseUrl}/comments/files/view/${filename}`;
  }

  toggleReply(commentId: number): void {
    this.replyingTo = this.replyingTo === commentId ? null : commentId;
    this.replyContent = '';
  }

  formatDate(dateArray: any): string {
    if (Array.isArray(dateArray)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
      const jsDate = new Date(year, month - 1, day, hour, minute, second);
      return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
    } else {
      // Handle string date
      const jsDate = new Date(dateArray);
      return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
    }
  }

  cancelNewContent() {
    this.newPostContent = '';
    this.selectedFile = null; // Reset file on cancel
  }

  cancelComment() {
    this.commentContent = '';
    this.commentSelectedFile = null; // Reset file on cancel
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onCommentFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.commentSelectedFile = input.files[0];
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  removeCommentFile() {
    this.commentSelectedFile = null;
  }
}