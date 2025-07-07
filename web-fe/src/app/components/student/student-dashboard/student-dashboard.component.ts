import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
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
  notification: string = '';

  constructor(private enrollmentService: EnrollmentService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0;
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state && nav.extras.state['notification']) {
      this.notification = nav.extras.state['notification'];
      setTimeout(() => this.notification = '', 3000);
    }
    this.loadAllClassByStudent();
  }

  loadAllClassByStudent() {
    this.enrollmentService.getAllClassByStudentId(this.userId).subscribe({
      next: (response) => {
        this.classes = response.map((c: any) => ({ ...c, studentCount: null }));
        this.classes.forEach((c: any, idx: number) => {
          this.enrollmentService.getAllStudentInClass(c.id).subscribe({
            next: (students) => {
              this.classes[idx].studentCount = students.length;
            },
            error: () => {
              this.classes[idx].studentCount = 0;
            }
          });
        });
      },
      error: (error) => {
        alert(`Lỗi khi lấy danh sách lớp: ${error.message}`);
      }
    });
  }
}
