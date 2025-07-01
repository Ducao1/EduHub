import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../../services/assignment.service';
import { AssignmentDTO } from '../../../../dtos/requests/assignment.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { Assignment } from '../../../../interfaces/assigment';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NotificationComponent
  ],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.scss'
})
export class AddAssignmentComponent implements OnInit {
  teacherId!: number;
  title = '';
  content = '';
  assignedDate!: Date;
  dueDate!: Date;
  classId!: number;
  attachment: File | null = null;
  selectedFiles: File[] = [];
  totalFileSize: number = 0;
  showNotification = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage = '';

  constructor(
    private assignmentService: AssignmentService,
    private router: Router,
    private userService : UserService,
    private route: ActivatedRoute
  ){}

  ngOnInit(){
    this.teacherId = this.userService.getUserId() ?? 0;
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Teacher ID:', this.teacherId);
    console.log('class ID: ',this.classId);
  }

  addAssignment() {
    if (this.totalFileSize > 5 * 1024 * 1024) {
      return;
    }
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('content', this.content);
    formData.append('classId', this.classId.toString());
    formData.append('teacherId', this.teacherId.toString());
    if (this.assignedDate) {
      formData.append('assignedDate', new Date(this.assignedDate).toISOString());
    }
    if (this.dueDate) {
      formData.append('dueDate', new Date(this.dueDate).toISOString());
    }
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (const file of this.selectedFiles) {
        formData.append('files', file, file.name);
      }
    }
    this.assignmentService.addAssignment(formData).subscribe({
      next: (response) => {
        this.showNotification = true;
        this.notificationType = 'success';
        this.notificationMessage = 'Bài tập được tạo thành công!';
        setTimeout(() => {
          this.showNotification = false;
          this.router.navigate([`/teacher/class/assignments/${this.classId}`]);
        }, 2000);
      },
      error: (error) => {
        this.showNotification = true;
        this.notificationType = 'error';
        this.notificationMessage = error.error || 'Đã xảy ra lỗi khi tạo bài tập!';
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    });
  }

  onFilesSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
      this.totalFileSize = this.selectedFiles.reduce((acc, file) => acc + file.size, 0);
    } else {
      this.selectedFiles = [];
      this.totalFileSize = 0;
    }
  }

  resetDates() {
    this.assignedDate = null as any;
    this.dueDate = null as any;
  }

  cancel() {
    this.router.navigate(['/teacher/assignment', this.classId]);
  }

  onNotificationClose() {
    this.showNotification = false;
  }
}
