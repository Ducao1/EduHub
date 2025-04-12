import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../services/enrollment.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {
  userId!: number;
  classes: any[] = [];

  constructor(private enrollmentService: EnrollmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0;
    this.loadStudentClasses();
  }

  loadStudentClasses() {
    this.enrollmentService.getStudentClasses(this.userId).subscribe({
      next: (response) => {
        debugger
        this.classes = response;
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách lớp: ${err.message}`);
      }
    });
  }
}
