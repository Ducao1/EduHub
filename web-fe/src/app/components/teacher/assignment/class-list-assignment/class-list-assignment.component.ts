import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { TeacherNavBarComponent } from '../../teacher-nav-bar/teacher-nav-bar.component';
import { AssignmentDTO } from '../../../../dtos/requests/assignment.dto';
import { ClassroomService } from '../../../../services/classroom.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-class-list-assignment',
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent,
    FormsModule
  ],
  templateUrl: './class-list-assignment.component.html',
  styleUrl: './class-list-assignment.component.scss',
  providers: [DatePipe]
})
export class ClassListAssignmentComponent implements OnInit {
  assignments: any[] = [];
  classId!: number;
  className!: string;
  currentPage: number = 0;
  pageSize: number = 6;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  activeDropdownIndex: number = -1;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private classroomService: ClassroomService
  ) {
  }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.loadClassInfo();
    this.loadAssignments();
    this.searchSubject.pipe(debounceTime(400)).subscribe(term => {
      this.currentPage = 0;
      this.searchTerm = term;
      this.loadAssignments();
    });
  }

  loadClassInfo() {
    this.classroomService.getClassById(this.classId).subscribe({
      next: (response) => {
        this.className = response.name;
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin lớp:', err);
      }
    });
  }

  loadAssignments(): void {
    this.assignmentService.getAssignmentsByClassId(this.classId, this.currentPage, this.pageSize, this.searchTerm).subscribe({
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

  toggleDropdown(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? -1 : index;
  }

  viewListScoreOfAssignment(){

  }

  updateAssignment(id: number) {
    // Example: navigate to update page or open a dialog (customize as needed)
    // this.router.navigate(['/teacher/update-assignment', id]);
    alert('Chức năng cập nhật sẽ được bổ sung!');
  }

  deleteAssignment(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      this.assignmentService.deleteAssignment(id).subscribe({
        next: () => {
          alert('Xóa bài tập thành công!');
          this.loadAssignments();
        },
        error: (err) => {
          alert('Xóa thất bại: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  goToScoreList(id: number) {
    this.router.navigate(['/teacher/assignment',this.classId, id, 'scores']);
  }

  onSearchInput(term: string) {
    this.searchSubject.next(term);
  }
}
