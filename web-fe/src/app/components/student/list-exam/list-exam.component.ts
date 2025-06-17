import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
  pageSize: number = 9; // Adjust as needed
  totalPages: number = 0;
  currentPage: number = 1; // Start with page 1 for display, 0 for API
  totalElements: number = 0;
  visiblePages: number[] = [];

  constructor(
    private classExamService: ClassExamService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

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
    this.classExamService.getExamByClass(this.classId, this.currentPage - 1, this.pageSize).subscribe({
      next: (response) => {
        this.exams = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách bài thi:', err);
        alert(`Lỗi khi lấy danh sách bài thi: ${err.error?.message || err.message}`);
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadExams();
    }
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
    if (!dateArray || dateArray.length < 3) return '';
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }
}