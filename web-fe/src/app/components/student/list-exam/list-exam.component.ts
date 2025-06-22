import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StudentNavBarComponent } from '../student-nav-bar/student-nav-bar.component';
import { ClassExamService } from '../../../services/class-exam.service';

@Component({
  selector: 'app-list-exam',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentNavBarComponent],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.scss',
  providers: [DatePipe]
})
export class ListExamComponent implements OnInit {
  classId!: number;
  exams: any[] = [];
  currentPage: number = 0;
  pageSize: number = 9;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  studentExamStatus: any;

  constructor(
    private classExamService: ClassExamService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.classId) {
      console.error('classId không hợp lệ:', this.classId);
      alert('Thiếu classId trong URL. Vui lòng kiểm tra lại.');
      return; // Có thể redirect về trang dashboard nếu cần
    }
    this.loadExams();
  }

  loadExams(): void {
    this.classExamService.getExamByClass(this.classId, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.exams = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách bài thi:', err);
        alert(`Lỗi khi lấy danh sách bài thi: ${err.error?.message || err.message}`);
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
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, (this.currentPage + 1) - halfVisiblePages);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.visiblePages = new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) return '';
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }

  takeExam(examId: number): void {
    this.router.navigate(['/confirm-exam', examId]);
  }
}