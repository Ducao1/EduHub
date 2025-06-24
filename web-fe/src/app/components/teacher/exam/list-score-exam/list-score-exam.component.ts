import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScoreService } from '../../../../services/score.service';
import { ExamService } from '../../../../services/exam.service';
import { ScoreAssignmentResponse } from '../../../../interfaces/score';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";

@Component({
  selector: 'app-list-score-exam',
  standalone: true,
  imports: [CommonModule, TeacherNavBarComponent],
  templateUrl: './list-score-exam.component.html',
  styleUrl: './list-score-exam.component.scss'
})
export class ListScoreExamComponent implements OnInit {
  examId!: number;
  examTitle: string = '';
  scores: ScoreAssignmentResponse[] = [];
  paginatedScores: ScoreAssignmentResponse[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(private route: ActivatedRoute, private scoreService: ScoreService, private examService: ExamService) {}

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExamTitle();
    this.loadScores();
  }

  loadExamTitle() {
    this.examService.getExamById(this.examId).subscribe({
      next: (res) => {
        this.examTitle = res.title || '';
      },
      error: () => {
        this.examTitle = '';
      }
    });
  }

  loadScores() {
    this.scoreService.getScoresByExamId(this.examId).subscribe({
      next: (response) => {
        this.scores = response;
        this.totalPages = Math.ceil(this.scores.length / this.pageSize);
        this.onPageChange(1);
      },
      error: (err) => {
        alert('Lỗi khi lấy danh sách điểm: ' + (err.error?.message || err.message));
      }
    });
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedScores = this.scores.slice(startIndex, endIndex);
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
    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
}
