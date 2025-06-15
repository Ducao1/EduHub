import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ClassExamService } from '../../../../services/class-exam.service';

@Component({
  selector: 'app-class-list-exam',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './class-list-exam.component.html',
  styleUrl: './class-list-exam.component.scss',
  providers: [DatePipe]
})
export class ClassListExamComponent implements OnInit {
  classId!: number;
  exams: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  activeDropdownIndex: number = -1;

  constructor(
    private classExamService: ClassExamService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExams();
  }

  loadExams(): void {
    this.classExamService.getExamByClass(this.classId, this.currentPage - 1, this.pageSize).subscribe({
      next: (response) => {
        debugger
        this.exams = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách bài thi: ${err.error}`);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadExams();
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

  toggleDropdown(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? -1 : index;
  }

  monitorExam(examId: number) {
    debugger
    this.router.navigate(['/session-exam', examId, 'class', this.classId]);
  }

  viewScores(examId: number) {
    this.router.navigate(['/teacher/list-score', examId]);
  }
}
