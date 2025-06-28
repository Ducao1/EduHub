import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScoreService } from '../../../../services/score.service';
import { ExamService } from '../../../../services/exam.service';
import { ScoreAssignmentResponse, ScoreExamResponse } from '../../../../interfaces/score';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-score-exam',
  standalone: true,
  imports: [CommonModule, TeacherNavBarComponent],
  templateUrl: './list-score-exam.component.html',
  styleUrl: './list-score-exam.component.scss',
  providers: [DatePipe]
})
export class ListScoreExamComponent implements OnInit {
  examId!: number;
  examTitle: string = '';
  scores: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreService,
    private examService: ExamService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.loadExamTitle();
    this.loadScores();
  }

  loadExamTitle() {
    this.examService.getExamById(this.examId).subscribe({
      next: (res) => {
        debugger
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
        debugger
        this.scores = response;
      },
      error: (err) => {
        debugger
        alert('Lỗi khi lấy danh sách điểm: ' + (err.error?.message || err.message));
      }
    });
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }

  exportExcel() {
    this.scoreService.exportExamScoresToExcel(this.examId).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Scores_${this.examTitle || 'exam'}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
