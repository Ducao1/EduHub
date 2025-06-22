import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../services/assignment.service';
import { StudentNavBarComponent } from '../student-nav-bar/student-nav-bar.component';

@Component({
  selector: 'app-list-assignment',
  imports: [
      CommonModule,
      RouterModule,
      StudentNavBarComponent
  ],
  templateUrl: './list-assignment.component.html',
  styleUrl: './list-assignment.component.scss',
  providers: [DatePipe]
})
export class ListAssignmentComponent implements OnInit {
  classId!: number;
  assignments: any[] = [];
  pageSize: number = 9;
  totalPages: number = 0;
  currentPage: number = 0;
  totalElements: number = 0;
  visiblePages: number[] = [];

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentService.getAssignmentsByClassId(this.classId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
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

  updateVisiblePages(): void {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(this.currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, this.totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    this.visiblePages = new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }
}
