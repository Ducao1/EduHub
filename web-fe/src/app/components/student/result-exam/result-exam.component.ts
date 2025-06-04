import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  submission: any= {};
  submissionId!: number;

  constructor(
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.submissionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSubmission();
  }

  loadSubmission() {
    this.submissionService.getSubmissionById(this.submissionId).subscribe({
      next: (response) => {
        debugger
        this.submission = response;
        console.log('Kết quả bài làm:', response.score);
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }
}
