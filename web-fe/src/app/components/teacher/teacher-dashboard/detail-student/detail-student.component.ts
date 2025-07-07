import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { User } from '../../../../interfaces/user';
import { ClassroomService } from '../../../../services/classroom.service';
import { NotificationComponent } from '../../../../components/notification/notification.component';

@Component({
  selector: 'app-detail-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent,
    NotificationComponent
  ],
  templateUrl: './detail-student.component.html',
  styleUrl: './detail-student.component.scss'
})
export class DetailStudentComponent implements OnInit {
  classId!: number;
  studentId!: number;
  className: string = '';
  student: User | null = null;
  allTasks: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  showNotification: boolean = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private classroomService: ClassroomService
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.studentId = Number(this.route.snapshot.paramMap.get('studentId'));
    
    this.loadClassInfo();
    this.loadStudentInfo();
    this.loadStudentTasks();
  }

  loadClassInfo() {
    this.classroomService.getClassById(this.classId).subscribe({
      next: (response) => {
        this.className = response.name;
      },
      error: (err) => {
        this.showNotificationMessage('error', 'Lỗi khi lấy thông tin lớp học');
      }
    });
  }

  loadStudentInfo() {
    this.userService.getUserById(this.studentId).subscribe({
      next: (response) => {
        this.student = response;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin sinh viên';
        this.showNotificationMessage('error', 'Lỗi khi lấy thông tin sinh viên');
      }
    });
  }

  loadStudentTasks() {
    this.loading = true;
    this.userService.getStudentTasksInClass(this.studentId, this.classId).subscribe({
      next: (response) => {
        if (response && response.classTasks && response.classTasks.length > 0) {
          const classTask = response.classTasks[0];
          this.allTasks = [
            ...classTask.assignments.map((assignment: any) => ({
              ...assignment,
              taskType: 'ASSIGNMENT'
            })),
            ...classTask.exams.map((exam: any) => ({
              ...exam,
              taskType: 'EXAM'
            }))
          ];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách bài tập và bài thi:', err);
        this.allTasks = [];
        this.loading = false;
        this.showNotificationMessage('error', 'Lỗi khi lấy thông tin bài tập và bài thi');
      }
    });
  }

  onBack() {
    this.router.navigate(['/teacher/class', this.classId]);
  }

  showNotificationMessage(type: 'success' | 'warning' | 'error', message: string) {
    this.notificationType = type;
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    this.showNotification = false;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'NOT_SUBMITTED':
        return 'Chưa nộp';
      case 'SUBMITTED':
        return 'Đã nộp';
      case 'LATE':
        return 'Nộp muộn';
      case 'GRADED':
        return 'Đã chấm điểm';
      default:
        return status;
    }
  }

  getTypeText(type: string): string {
    return type === 'ASSIGNMENT' ? 'Bài tập' : 'Bài thi';
  }

  getAvatarUrl(avatar: string | undefined): string {
    if (!avatar) {
      return 'assets/img/default-avatar.png';
    }
    return avatar.startsWith('http') ? avatar : `http://localhost:8080${avatar}`;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Chưa cập nhật';
    }
  }

  getGenderText(gender: boolean | undefined): string {
    if (gender === undefined) return 'Chưa cập nhật';
    return gender ? 'Nam' : 'Nữ';
  }
}
