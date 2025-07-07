import { Component, NgModule } from '@angular/core';
import { ClassroomService } from '../../../../services/classroom.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-add-class',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './add-class.component.html',
  styleUrl: './add-class.component.scss'
})
export class AddClassComponent {
  className = '';
  description = '';
  
  showNotification = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage = '';

  constructor(private classroomService: ClassroomService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  createClass() {
    this.classroomService.addClass(this.className, this.description).subscribe({
      next: (response) => {
        this.showSuccessNotification('Lớp học được tạo thành công!');
        setTimeout(() => {
          this.router.navigate(['/teacher/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.showErrorNotification('Lỗi khi tạo lớp: ' + err.message);
      }
    });
  }

  showSuccessNotification(message: string) {
    this.notificationType = 'success';
    this.notificationMessage = message;
    this.showNotification = true;
  }

  showErrorNotification(message: string) {
    this.notificationType = 'error';
    this.notificationMessage = message;
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }

  cancel() {
    this.router.navigate(['/teacher/dashboard']);
  }
}
