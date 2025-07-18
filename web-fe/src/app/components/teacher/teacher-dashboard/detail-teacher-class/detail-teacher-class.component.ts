import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CommentService } from '../../../../services/comment.service';
import { UserService } from '../../../../services/user.service';
import { Comment as IComment } from '../../../../interfaces/comment';
import { NotificationComponent } from '../../../notification/notification.component';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detail-teacher-class',
  standalone: true,
  imports: [
    RouterModule, 
    TeacherNavBarComponent,
    FormsModule,
    CommonModule,
    NotificationComponent
  ],
  templateUrl: './detail-teacher-class.component.html',
  styleUrl: './detail-teacher-class.component.scss',
  providers: [DatePipe]
})
export class DetailTeacherClassComponent implements OnInit {
  classId!: number;
    className: string = 'Lớp Học Mẫu';
    classDescription: string = 'Mô tả lớp học mẫu cho sinh viên.';
    newPostContent: string = '';
    commentContent: string = '';
    selectedFiles: File[] = [];
    commentSelectedFiles: File[] = [];
  
    // Comment related properties
    comments: IComment[] = [];
    currentUserId: number | null = null;
    replyingTo: number | null = null;
    replyContent: string = '';
  
    commentContentMap: { [parentId: number]: string } = {};
  
    openDropdownCommentId: number | null = null;
    classCode: string = '';
  
    notification: { type: 'success' | 'warning' | 'error', message: string } | null = null;
  
    currentUserAvatar: string = '';
    currentUserName: string = '';
  
    constructor(
      private route: ActivatedRoute,
      private classroomService: ClassroomService,
      private commentService: CommentService,
      private userService: UserService,
      private datePipe: DatePipe,
      private enrollmentService: EnrollmentService
    ) { }
  
    ngOnInit() {
      this.classId = Number(this.route.snapshot.paramMap.get('classId'));
      this.currentUserId = this.userService.getUserId();
      if (this.currentUserId) {
        this.userService.getUserById(this.currentUserId).subscribe(user => {
          this.currentUserAvatar = user.avatar || '';
          this.currentUserName = user.fullName || '';
        });
      }
      this.loadClassInfo();
      this.loadComments();
      
    }
  
    loadClassInfo() {
      this.classroomService.getClassById(this.classId).subscribe({
        next: (response) => {
          this.className = response.name;
          this.classDescription = response.description || 'Không có mô tả.';
          this.classCode = response.code || '';
        },
        error: (err) => {
          console.error('Lỗi khi lấy thông tin lớp:', err);
        }
      });
    }
  
    loadComments() {
      this.commentService.getAllCommentsByClassId(this.classId).subscribe({
        next: (allComments) => {
          // Lấy tất cả userId duy nhất từ comments và subComments
          const userIds = new Set<number>();
          allComments.forEach(c => {
            userIds.add(c.userId);
            if (c.subComments) c.subComments.forEach((sc: any) => userIds.add(sc.userId));
          });
          const userRequests = Array.from(userIds).map(id => this.userService.getUserById(id));
          forkJoin(userRequests).subscribe((users: any[]) => {
            const userMap = new Map<number, any>();
            users.forEach(u => userMap.set(u.id, u));
            // Gán avatar cho từng comment và subComment
            allComments.forEach(c => {
              c.avatar = userMap.get(c.userId)?.avatar || '';
              if (c.subComments) {
                c.subComments.forEach((sc: any) => {
                  sc.avatar = userMap.get(sc.userId)?.avatar || '';
                });
              }
            });
            // Sắp xếp lại comments như cũ
            const parentComments = allComments.filter(c => !c.parentCommentId);
            parentComments.forEach(parent => {
              parent.subComments = allComments.filter(c => c.parentCommentId === parent.id)
                .sort((a, b) => {
                  const dateA = Array.isArray(a.createdAt)
                    ? new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5])
                    : new Date(a.createdAt);
                  const dateB = Array.isArray(b.createdAt)
                    ? new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5])
                    : new Date(b.createdAt);
                  return dateA.getTime() - dateB.getTime();
                });
              (parent as any).likedByCurrentUser = (parent as any).likedByCurrentUser ?? false;
              (parent as any).likeCount = (parent as any).likeCount ?? 0;
              parent.subComments.forEach((sub: any) => {
                sub.likedByCurrentUser = sub.likedByCurrentUser ?? false;
                sub.likeCount = sub.likeCount ?? 0;
              });
            });
            this.comments = parentComments.sort((a, b) => {
              const dateA = Array.isArray(a.createdAt)
                ? new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5])
                : new Date(a.createdAt);
              const dateB = Array.isArray(b.createdAt)
                ? new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5])
                : new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });
          });
        },
        error: (err) => {
          console.error('Lỗi khi tải comments:', err);
        }
      });
    }
  
    postNewContent() {
      this.postNewComment(null);
    }
  
    postComment() {
      console.log('Posting comment:', this.commentContent);
      if (this.commentSelectedFiles.length > 0) {
        console.log('Attached files:', this.commentSelectedFiles.map(f => f.name));
      }
      this.commentContent = '';
      this.commentSelectedFiles = []; // Reset files after posting
    }
  
    postNewComment(parentId: number | null = null): void {
      const content = parentId ? this.commentContentMap[parentId] || '' : this.newPostContent;
      if (!this.classId || !content.trim()) {
        return;
      }
  
      const formData = new FormData();
      formData.append('content', content);
      formData.append('classId', this.classId.toString());
      if (parentId) {
        formData.append('parentCommentId', parentId.toString());
      }
  
      // Append all files
      if (parentId && this.commentSelectedFiles.length > 0) {
        this.commentSelectedFiles.forEach(file => formData.append('files', file, file.name));
      }
      if (!parentId && this.selectedFiles.length > 0) {
        this.selectedFiles.forEach(file => formData.append('files', file, file.name));
      }
  
      this.commentService.createComment(formData).subscribe({
        next: () => {
          this.loadComments();
          if (parentId) {
            this.commentContentMap[parentId] = '';
            this.commentSelectedFiles = [];
          } else {
            this.newPostContent = '';
            this.selectedFiles = [];
          }
        },
        error: (err) => console.error('Error posting comment', err)
      });
    }
  
    handleDeleteComment(commentId: number): void {
      if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            this.loadComments();
          },
          error: (err) => {
            alert(`Không thể xóa bình luận: ${err.error?.message || err.message}`);
          }
        });
      }
    }
  
    getAttachmentUrl(filePath: string): string {
      const filename = filePath.split(/[\\/]/).pop();
      return `http://localhost:8080/uploads/comments/${filename}`;
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
      this.selectedFiles = []; // Reset files on cancel
    }
  
    cancelComment() {
      this.commentContent = '';
      this.commentSelectedFiles = []; // Reset files on cancel
    }
  
    handleFilesSelected(event: Event, targetArray: File[]) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        let currentTotal = targetArray.reduce((sum, file) => sum + file.size, 0);
        for (let i = 0; i < input.files.length; i++) {
          const file = input.files[i];
          if (currentTotal + file.size > 5 * 1024 * 1024) {
            alert('Tổng dung lượng file upload không quá 5MB!');
            break;
          }
          targetArray.push(file);
          currentTotal += file.size;
        }
      }
    }
  
    removeSelectedFile(index: number) {
      this.selectedFiles.splice(index, 1);
    }
  
    removeCommentFile(index: number) {
      this.commentSelectedFiles.splice(index, 1);
    }
  
    deleteComment(commentId: number): void {
      if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            this.loadComments();
          },
          error: (err) => {
            alert(`Không thể xóa bình luận: ${err.error?.message || err.message}`);
          }
        });
      }
    }
  
    toggleDropdown(commentId: number) {
      console.log('Toggling dropdown for comment ID:', commentId, 'Current openDropdownCommentId:', this.openDropdownCommentId);
      this.openDropdownCommentId = this.openDropdownCommentId === commentId ? null : commentId;
      console.log('New openDropdownCommentId:', this.openDropdownCommentId);
    }
  
    toggleLike(comment: any) {
      if (comment.likedByCurrentUser) {
        this.commentService.unlikeComment(comment.id).subscribe(() => {
          comment.likedByCurrentUser = false;
          comment.likeCount = (comment.likeCount || 1) - 1;
        });
      } else {
        this.commentService.likeComment(comment.id).subscribe(() => {
          comment.likedByCurrentUser = true;
          comment.likeCount = (comment.likeCount || 0) + 1;
        });
      }
    }
  
    setNotification(type: 'success' | 'warning' | 'error', message: string) {
      this.notification = { type, message };
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    }
  
    refreshClassCode() {
      this.classroomService.refreshClassCode(this.classId).subscribe({
        next: (response) => {
          debugger
          this.classCode = response.code || '';
          this.setNotification('success', 'Làm mới mã lớp thành công!');
        },
        error: (err) => {
          this.setNotification('error', 'Làm mới mã lớp thất bại!');
          this.loadClassInfo();
        }
      });
    }
  
    isImage(filePath: string): boolean {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filePath);
    }
}
