import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { TeacherNavBarComponent } from '../../teacher-nav-bar/teacher-nav-bar.component';
import { Score } from '../../../../interfaces/score';
import { Submission } from '../../../../interfaces/submission';
import { AssignmentService } from '../../../../services/assignment.service';
import { ScoreService } from '../../../../services/score.service';
import { ScoreAssignmentResponse } from '../../../../interfaces/score';

@Component({
  selector: 'app-list-score-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, TeacherNavBarComponent],
  templateUrl: './list-score-assignment.component.html',
  styleUrl: './list-score-assignment.component.scss'
})
export class ListScoreAssignmentComponent implements OnInit {
  assignmentId!: number;
  scores: ScoreAssignmentResponse[] = [];
  paginatedScores: ScoreAssignmentResponse[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];
  assignmentTitle: string = '';

  constructor(private route: ActivatedRoute, private scoreService: ScoreService, private assignmentService: AssignmentService) {}

  ngOnInit() {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAssignmentTitle();
    this.loadScores();
  }

  loadAssignmentTitle() {
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (res) => {
        this.assignmentTitle = res.title || '';
      },
      error: () => {
        this.assignmentTitle = '';
      }
    });
  }

  loadScores() {
    this.scoreService.getScoresByAssignmentId(this.assignmentId).subscribe({
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
