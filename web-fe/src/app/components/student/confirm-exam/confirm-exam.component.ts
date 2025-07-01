import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { ExamStatusService } from '../../../services/exam-status.service';
import { ExamStatusType } from '../../../dtos/enums/exam-status-type.enum';
import { UserService } from '../../../services/user.service';
import { ExamCacheService } from '../../../services/exam-cache.service';

@Component({
  selector: 'app-confirm-exam',
  templateUrl: './confirm-exam.component.html',
  styleUrls: ['./confirm-exam.component.scss']
})
export class ConfirmExamComponent implements OnInit {
  examId!: number;
  classId!: number;
  exam: any = {};

  constructor(
    private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute,
    private examStatusService: ExamStatusService,
    private userService: UserService,
    private examCacheService: ExamCacheService
  ) {}

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    if (!this.examId || !this.classId) {
      console.error('examId hoặc classId không hợp lệ:', { examId: this.examId, classId: this.classId });
      alert('Thiếu examId hoặc classId trong URL. Vui lòng kiểm tra lại.');
      this.router.navigate(['/student/dashboard']);
      return;
    }
    this.loadExamDetails();
  }

  loadExamDetails() {
    const cachedExam = this.examCacheService.getExam(this.examId);
    if (cachedExam) {
      this.exam = cachedExam;
      // if (!cachedExam.classExams?.some((ce: any) => ce.classroom?.id === this.classId)) {
      //   console.error('Class ID không hợp lệ cho bài thi');
      //   alert('Lớp không được giao bài thi này');
      //   this.router.navigate(['/student/dashboard']);
      // }
      return;
    }

    this.examService.getExamById(this.examId, { classId: this.classId }).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.examCacheService.setExam(this.examId, exam);
        // if (!exam.classExams?.some((ce: any) => ce.classroom?.id === this.classId)) {
        //   console.error('Class ID không hợp lệ cho bài thi');
        //   alert('Lớp không được giao bài thi này');
        //   this.router.navigate(['/student/dashboard']);
        // }
      },
      error: (err) => {
        console.error('Lỗi khi tải bài thi:', err);
        alert('Không thể tải bài thi. Vui lòng thử lại.');
        this.router.navigate(['/student/dashboard']);
      }
    });
  }

  confirm(): void {
    const studentId = this.userService.getUserId() ?? 0;
    if (studentId) {
      this.examStatusService.updateStatus(this.examId, studentId, ExamStatusType.IN_PROGRESS, this.classId);
    }
    this.router.navigate(['/take-exam', this.examId, 'class', this.classId]);
  }

  get durationInMinutes(): number {
    if (!this.exam?.duration) return 0;
    return Math.floor(this.exam.duration / 60000);
  }
}