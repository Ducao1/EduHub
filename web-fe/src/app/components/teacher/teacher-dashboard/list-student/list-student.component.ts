import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent
],
  templateUrl: './list-student.component.html',
  styleUrl: './list-student.component.scss'
})
export class ListStudentComponent {
  classId!: number;
  students: any[] = [];
  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAllStudent();
  }

  loadAllStudent() {
    this.enrollmentService.getAllStudentInClass(this.classId).subscribe({
      next: (response) => {
        debugger
        this.students = response;
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách sinh viên: ${err.message}`);
      }
    })
  }
}