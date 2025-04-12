import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubmissionService } from '../../../services/submission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-exam',
  standalone: true,
  imports:[
    CommonModule,
    RouterModule
  ],
  templateUrl: './result-exam.component.html',
  styleUrl: './result-exam.component.scss',
})
export class ResultExamComponent implements OnInit {
  submission: any;
  submissionId!: number;

  constructor(
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
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
        console.log('Kết quả bài làm:', response);
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }
}
