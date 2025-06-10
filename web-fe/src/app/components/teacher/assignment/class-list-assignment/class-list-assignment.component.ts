import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { TeacherNavBarComponent } from '../../teacher-nav-bar/teacher-nav-bar.component';

@Component({
  selector: 'app-class-list-assignment',
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent
  ],
  templateUrl: './class-list-assignment.component.html',
  styleUrl: './class-list-assignment.component.scss',
  providers: [DatePipe]
})
export class ClassListAssignmentComponent implements OnInit {
  assignments: any[] = [];
  classId!: number;
  currentPage: number = 1; // Start with page 1 for display, 0 for API
  pageSize: number = 9; // Adjust as needed
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentService.getAssignmentsByClassId(this.classId, this.currentPage -1, this.pageSize).subscribe({
      next: (response) => {
        debugger
        this.assignments = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách bài tập: ${err.error}`);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAssignments();
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

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }
}
