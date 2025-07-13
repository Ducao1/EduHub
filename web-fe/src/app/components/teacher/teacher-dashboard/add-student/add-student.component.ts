import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { EnrollmentDTO } from '../../../../dtos/requests/enrollment.dto';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent {
  classId!: number;
  email!: string;
  notification = {
    show: false,
    type: 'success' as 'success' | 'warning' | 'error',
    message: ''
  };

  constructor(
    private enrollmentService: EnrollmentService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.classId = Number(this.activedRoute.snapshot.paramMap.get('classId'));
  }

  addStudent() {
    const enrollmentDTO: EnrollmentDTO = {
      class_id: this.classId,
      email: this.email,
    };

    this.enrollmentService.addStudent(enrollmentDTO).subscribe({
      next: (response: any) => {
        this.notification = {
          show: true,
          type: 'success',
          message: 'Thêm sinh viên thành công!'
        };
        setTimeout(() => {
          this.notification.show = false;
          this.router.navigate(['/teacher/class', this.classId]);
        }, 1500);
      },
      error: (error: any) => {
        this.notification = {
          show: true,
          type: 'error',
          message: error.error || 'Thêm sinh viên thất bại!'
        };
        setTimeout(() => this.notification.show = false, 2000);
      }
    });
  }

  cancel() {
    this.router.navigate(['/teacher/class', this.classId]);
  }


}
