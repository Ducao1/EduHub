import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubmissionService } from '../../../services/submission.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-result-exam',
  standalone: true,
  imports:[
    CommonModule,
    RouterModule
  ],
  templateUrl: './result-exam.component.html',
  styleUrl: './result-exam.component.scss',
  providers: [DatePipe]
})
export class ResultExamComponent implements OnInit {
  submissionId!: number;
  examResult: any = {};
  timeTakenStr: string = '';

  constructor(
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.submissionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExamResult();
  }

  loadExamResult() {
    this.submissionService.getExamResult(this.submissionId).subscribe({
      next: (result) => {
        this.examResult = result;
        this.timeTakenStr = this.formatDuration(result.timeTaken);
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  formatDuration(ms: number): string {
    if (!ms) return '---';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây`;
  }

  formatDateArray(arr: number[]): string {
    if (!arr || arr.length < 3) return '---';
    const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm:ss dd/MM/yyyy') || '';
  }
}
