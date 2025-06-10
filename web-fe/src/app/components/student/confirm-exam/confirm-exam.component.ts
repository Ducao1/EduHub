import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-confirm-exam',
  templateUrl: './confirm-exam.component.html',
  styleUrls: ['./confirm-exam.component.scss']
})
export class ConfirmExamComponent implements OnInit {
  examId!: number;
  exam: any = {};

  constructor(
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExamDetails();
  }

  loadExamDetails(): void {
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        this.exam = exam;
      },
      error: (err) => {
        console.error('Lỗi khi tải bài thi:', err);
      }
    });
  }

  confirm(): void {
    this.router.navigate(['/take-exam', this.examId]);
  }
}
