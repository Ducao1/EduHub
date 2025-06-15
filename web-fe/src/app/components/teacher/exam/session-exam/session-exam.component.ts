import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from '../../../../services/exam.service';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { ExamStatusType } from '../../../../dtos/enums/exam-status-type.enum';
import { Exam } from '../../../../interfaces/exam';
import { ExamStatus } from '../../../../interfaces/exam-status';
import { ExamStatusService } from '../../../../services/exam-status.service';
import { StudentExamStatus } from '../../../../interfaces/student-exam-status';

@Component({
  selector: 'app-session-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-exam.component.html',
  styleUrl: './session-exam.component.scss',
  providers: [DatePipe],
})
export class SessionExamComponent implements OnInit, OnDestroy {
  examId: number = 0;
  examName: string = '';
  className: string = '';
  classId: number = 0;
  teacherName: string = 'Cù Việt Dũng';
  timeRemaining: string = '01:30:00';
  activities: { message: string; timestamp: Date }[] = [];
  selectedTab: string = 'students';
  examStatuses: ExamStatus[] = [];
  private statusSubscription: Subscription;
  ExamStatusType = ExamStatusType;
  students: StudentExamStatus[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private examStatusService: ExamStatusService,
    private examService: ExamService,
  ) {
    this.statusSubscription = new Subscription();
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
  }

  ngOnInit(): void {
    this.loadExamDetails();
    this.initializeStatusMonitoring();
    this.examStatusService.subscribeToClassStudentsStatus(this.examId, this.classId);
    
    // Request initial list of students
    this.examStatusService.getClassStudentsWithExamStatus(this.examId, this.classId);

    this.subscriptions.push(
      this.examStatusService.studentStatuses$
        .subscribe(students => {
          this.students = students;
        })
    );
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
    this.examStatusService.disconnect();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadExamDetails(): void {
    this.examService.getExamById(this.examId).subscribe({
      next: (exam: Exam) => {
        this.examName = exam.title;
        const classExam = exam.classExams?.find(ce => ce.classroom?.id === this.classId);
        this.className = classExam?.classroom?.name || '';
        this.classId = classExam?.classroom?.id || 0;
      },
      error: (err: any) => {
        console.error('Error loading exam details:', err);
      },
    });
  }

  private initializeStatusMonitoring(): void {
    this.statusSubscription = this.examStatusService
      .subscribeToExamStatus(this.examId)
      .subscribe((statuses: ExamStatus[]) => {
        this.examStatuses = statuses;
      });
  }

  getStatusCount(status: ExamStatusType): number {
    return this.students.filter(s => s.status === status).length;
  }

  getStatusClass(status: ExamStatusType): string {
    switch (status) {
      case ExamStatusType.NOT_STARTED:
        return 'status-not-started';
      case ExamStatusType.IN_PROGRESS:
        return 'status-in-progress';
      case ExamStatusType.SUBMITTED:
        return 'status-submitted';
      default:
        return '';
    }
  }

  getStatusText(status: ExamStatusType): string {
    switch (status) {
      case ExamStatusType.NOT_STARTED:
        return 'Chưa bắt đầu';
      case ExamStatusType.IN_PROGRESS:
        return 'Đang làm bài';
      case ExamStatusType.SUBMITTED:
        return 'Đã nộp bài';
      default:
        return '';
    }
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
  }

  getTimeString(timestamp: number | null): string {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN');
  }
}