import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { CommonModule } from '@angular/common';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";

@Component({
  selector: 'app-teacher-detail-assignment',
  imports: [
    CommonModule,
    RouterModule,
],
  templateUrl: './teacher-detail-assignment.component.html',
  styleUrl: './teacher-detail-assignment.component.scss'
})
export class TeacherDetailAssignmentComponent {
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
      error: (error) => {
        debugger
        alert(error.error);
      }
    })
  }
}
