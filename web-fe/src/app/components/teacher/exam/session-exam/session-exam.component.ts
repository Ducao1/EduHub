import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from '../../../../services/exam.service';
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
    private router: Router,
    private examStatusService: ExamStatusService,
    private examService: ExamService,
  ) {
    this.statusSubscription = new Subscription();
  }

  ngOnInit(): void {
    debugger
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    console.log('examId:', this.examId, 'classId:', this.classId);
    if (!this.examId || !this.classId) {
      console.error('examId hoặc classId không hợp lệ:', { examId: this.examId, classId: this.classId });
      alert('Thiếu examId hoặc classId trong URL. Vui lòng kiểm tra lại.');
      this.router.navigate(['/']);
      return;
    }
    this.loadExamDetails();
    this.initializeStatusMonitoring();
    this.examStatusService.subscribeToClassStudentsStatus(this.examId, this.classId);
    this.examStatusService.getClassStudentsWithExamStatus(this.examId, this.classId);

    this.subscriptions.push(
      this.examStatusService.studentStatuses$.subscribe(students => {
        console.log('Danh sách trạng thái sinh viên:', students);
        this.students = students;
      })
    );

    // Lấy lại toàn bộ log hoạt động khi vào trang
    this.fetchActivityLog();

    // Đăng ký nhận log hoạt động sinh viên
    this.examStatusService.subscribeToStudentActivityLog(
      this.examId,
      this.classId,
      (activity: any) => {
        this.activities.unshift({
          message: this.getActivityMessage(activity),
          timestamp: new Date(activity.timestamp)
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.examStatusService.disconnect();
  }

  private loadExamDetails(): void {
    this.examService.getExamById(this.examId, { classId: this.classId }).subscribe({
      next: (exam: Exam) => {
        this.examName = exam.title || '';
      },
      error: (err: any) => {
        console.error('Lỗi khi tải chi tiết bài thi:', err);
        alert('Không thể tải chi tiết bài thi. Vui lòng thử lại.');
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
      case ExamStatusType.PENDING:
        return 'status-pending';
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
      case ExamStatusType.PENDING:
        return 'Đang chờ';
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
    if (tabName === 'activity') {
      this.fetchActivityLog();
    }
  }

  getTimeString(timestamp: number | null): string {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN');
  }

  private getActivityMessage(activity: any): string {
    switch (activity.activityType) {
      case 'FULLSCREEN_EXIT':
        return `Sinh viên ${activity.studentId} thoát chế độ toàn màn hình`;
      case 'TAB_CHANGE':
        return `Sinh viên ${activity.studentId} chuyển tab hoặc thu nhỏ cửa sổ`;
      case 'EXAM_LEFT':
        return `Sinh viên ${activity.studentId} rời khỏi trang làm bài`;
      default:
        return `Hoạt động không xác định từ sinh viên ${activity.studentId}`;
    }
  }

  private fetchActivityLog() {
    this.examStatusService.fetchActivityLog(this.examId, this.classId)
      .subscribe(logs => {
        this.activities = logs.map(activity => ({
          message: this.getActivityMessage(activity),
          timestamp: new Date(activity.timestamp)
        }));
      });
  }
}