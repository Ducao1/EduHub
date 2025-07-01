import { Component } from '@angular/core';
import { ClassroomService } from '../../../../services/classroom.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-assign-exam',
  standalone: true,
    imports:[
      CommonModule,
      RouterModule,
      FormsModule,
      NotificationComponent
    ],
  templateUrl: './assign-exam.component.html',
  styleUrl: './assign-exam.component.scss'
})
export class AssignExamComponent {
  userId!: number;
  classes: any[]=[];
  showNotification = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage = '';
  constructor(
    private classroomService: ClassroomService,
    private userService : UserService,
    private route: ActivatedRoute
  ){

  }
  ngOnInit(){
    this.userId = this.userService.getUserId() ?? 0;
    this.loadClasses();
  }

  loadClasses(){
    this.classroomService.getClassByTeacher(this.userId).subscribe({
      next: (response) => {
        debugger
        this.classes = response;
      },
      error: (err) => {
        this.showNotification = true;
        this.notificationType = 'error';
        this.notificationMessage = `Lỗi khi lấy danh sách lớp: ${err.message}`;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    });
  }

  assignExam() {
    // ... logic giao bài thi ...
    // this.examService.assignExam(...).subscribe({
    //   next: () => {
    //     this.showNotification = true;
    //     this.notificationType = 'success';
    //     this.notificationMessage = 'Giao bài thi thành công!';
    //     setTimeout(() => { this.showNotification = false; }, 2000);
    //   },
    //   error: (err) => {
    //     this.showNotification = true;
    //     this.notificationType = 'error';
    //     this.notificationMessage = err.error || 'Giao bài thi thất bại!';
    //     setTimeout(() => { this.showNotification = false; }, 3000);
    //   }
    // });
  }

  onNotificationClose() {
    this.showNotification = false;
  }
}
