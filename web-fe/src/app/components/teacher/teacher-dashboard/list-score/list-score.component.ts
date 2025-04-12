import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SubmissionService } from '../../../../services/submission.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-score',
  standalone: true,
  imports: [
    CommonModule,

  ],
  templateUrl: './list-score.component.html',
  styleUrl: './list-score.component.scss'
})
export class ListScoreComponent {
  examId!: number;
  submissions: any;

  constructor(
    private submissionService: SubmissionService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAllSubmissionByExam();
  }

  loadAllSubmissionByExam() {
    this.submissionService.getAllSubmissionByExamId(this.examId).subscribe({
      next: (response) => {
        debugger
        this.submissions = response;
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

}
