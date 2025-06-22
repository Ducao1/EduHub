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
  currentPage: number = 0; // Start with page 0 for API
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
    this.assignmentService.getAssignmentsByClassId(this.classId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        debugger
        this.assignments = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
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

  updateVisiblePages() {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }
}
