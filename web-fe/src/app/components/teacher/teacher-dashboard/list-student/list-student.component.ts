import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { User } from '../../../../interfaces/user';

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
  students: User[] = [];
  paginatedStudents: User[] = [];
  
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];

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
        this.totalPages = Math.ceil(this.students.length / this.pageSize);
        this.updatePaginatedStudents();
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách sinh viên: ${err.message}`);
      }
    })
  }

  updatePaginatedStudents(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudents = this.students.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePaginatedStudents();
    this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
  }
}