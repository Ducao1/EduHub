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
  constructor(
    private enrollmentService: EnrollmentService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0 ;
  }

  closeNotification() {
    this.notificationMessage = '';
  }

  joinClass() {
      const JoinClassDTO: JoinClassDTO = {
        student_id: this.userId,
        code: this.code,
      };
  
      this.enrollmentService.joinClass(JoinClassDTO).subscribe({
        next: (response: any) => {
          this.notificationType = 'success';
          this.notificationMessage = 'Đã gửi yêu cầu tham gia lớp';
          setTimeout(() => {
            this.router.navigate(['/student/dashboard'], { state: { notification: this.notificationMessage } });
            this.notificationMessage = '';
          }, 3000);
        },
        error: (error: any) => {
          this.notificationType = 'error';
          this.notificationMessage = 'mã lớp không tồn tại';
          setTimeout(() => this.notificationMessage = '', 3000);
        }
      });
    }

  goBack() {
    this.router.navigate(['/student/dashboard']);
  }
}
