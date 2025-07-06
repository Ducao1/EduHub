import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { JoinClassDTO } from '../../../../dtos/requests/join-class.dto';
import { UserService } from '../../../../services/user.service';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-join-class',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './join-class.component.html',
  styleUrl: './join-class.component.scss'
})
export class JoinClassComponent {
  code: any;
  classId!: number;
  userId!: number;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage: string = '';
  notificationTitle: string = '';
  showNotification: boolean = false;
  constructor(
    private enrollmentService: EnrollmentService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0 ;
  }

  closeNotification() {
    this.showNotification = false;
  }

  joinClass() {
      const JoinClassDTO: JoinClassDTO = {
        student_id: this.userId,
        code: this.code,
      };
  
      this.enrollmentService.joinClass(JoinClassDTO).subscribe({
        next: (response: any) => {
          this.notificationType = 'success';
          this.notificationTitle = 'Thành công';
          this.notificationMessage = 'Đã gửi yêu cầu tham gia lớp';
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
            this.router.navigate(['/student/dashboard'], { state: { notification: this.notificationMessage } });
          }, 1500);
        },
        error: (error: any) => {
          const errorMessage = error?.error?.error || error?.error || 'Tham gia lớp thất bại';
          if (errorMessage.includes('Bạn đã tham gia lớp học này')) {
            this.notificationType = 'warning';
            this.notificationTitle = 'Cảnh báo';
            this.notificationMessage = 'Bạn đã gửi yêu cầu tham gia lớp';
          } else {
            this.notificationType = 'error';
            this.notificationTitle = 'Lỗi';
            this.notificationMessage = errorMessage;
          }
          this.showNotification = true;
          setTimeout(() => this.showNotification = false, 2500);
        }
      });
    }

  goBack() {
    this.router.navigate(['/student/dashboard']);
  }
}
