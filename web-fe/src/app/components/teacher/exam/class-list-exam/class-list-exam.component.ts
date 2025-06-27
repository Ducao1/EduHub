import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ClassExamService } from '../../../../services/class-exam.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { ClassroomService } from '../../../../services/classroom.service';

@Component({
  selector: 'app-class-list-exam',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent
],
  templateUrl: './class-list-exam.component.html',
  styleUrl: './class-list-exam.component.scss',
  providers: [DatePipe]
})
export class ClassListExamComponent implements OnInit {
  classId!: number;
  className!: string;
  exams: any[] = [];
  currentPage: number = 0;
  pageSize: number = 6;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  activeDropdownIndex: number = -1;

  constructor(
    private classExamService: ClassExamService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private classroomService: ClassroomService
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.loadClassInfo();
    this.loadExams();
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


  loadExams(): void {
    this.classExamService.getExamByClass(this.classId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        debugger
        this.exams = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách bài thi: ${err.error}`);
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadExams();
    }
  }

  updateVisiblePages(): void {
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

  monitorExam(examId: number) {
    debugger
    this.router.navigate(['/session-exam', examId, 'class', this.classId]);
  }

  viewScores(examId: number) {
    this.router.navigate(['/teacher/exam',this.classId, examId, 'scores']);
  }
}
