import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-list-assignment',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './teacher-list-assignment.component.html',
  styleUrl: './teacher-list-assignment.component.scss',
  providers: [DatePipe]
})
export class TeacherListAssignmentComponent implements OnInit, OnDestroy {
  userId!: number;
  assignments: any[] = [];
  currentPage: number = 0;
  pageSize: number = 6;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  activeDropdownIndex: number = -1;
  
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userId = this.userService.getUserId() ?? 0;
    this.loadAssignments();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadAssignments();
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  loadAssignments(): void {
    this.assignmentService.getAssignmentsByTeacherId(this.userId, this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        debugger
        this.assignments = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    })
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAssignments();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadAssignments();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
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

  toggleDropdown(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? -1 : index;
  }

  deleteAssignment(assignmentId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      alert('Chức năng xóa bài tập chưa được triển khai');
    }
  }
}
