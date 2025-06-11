import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamStatus, ExamStatusType, ExamStatusService } from '../../../../services/exam-status.service';
import { ExamService } from '../../../../services/exam.service';

interface Exam {
  id: number;
  title: string;
  duration: number;
  class?: { name: string };
}

@Component({
  selector: 'app-session-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-exam.component.html',
  styleUrl: './session-exam.component.scss',
  providers: [DatePipe]
})
export class SessionExamComponent implements OnInit, OnDestroy {
  examId: number = 0;
  examName: string = '';
  className: string = '';
  teacherName: string = 'Cù Việt Dũng';
  timeRemaining: string = '01:30:00'; // Example, will be dynamic
  activities: { message: string, timestamp: Date }[] = [];
  students: { id: number, name: string, status: string, time: string }[] = [];
  selectedTab: string = 'students';
  examStatuses: ExamStatus[] = [];
  private statusSubscription: Subscription;
  ExamStatusType = ExamStatusType;

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private examStatusService: ExamStatusService,
    private examService: ExamService
  ) {
    this.statusSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExamDetails();
    this.initializeStatusMonitoring();

    // Simulate real-time activity updates
    this.addActivity('Sinh viên Nguyễn Văn A đã tham gia bài thi.', new Date());
    setTimeout(() => {
      this.addActivity('Sinh viên Trần Thị B đã nộp bài.', new Date());
    }, 5000);
    setTimeout(() => {
      this.addActivity('Sinh viên Lê Văn C đã thoát màn hình.', new Date());
    }, 10000);
    setTimeout(() => {
      this.addActivity('Sinh viên Phạm Thị D đã chuyển tab.', new Date());
    }, 15000);

    // Simulate student data
    this.students = [
      { id: 1, name: 'Nguyễn Ngọc Quỳnh Anh', status: 'Đang thi', time: '1 phút' },
      { id: 2, name: 'Đinh Ngọc Cẩm Tiên', status: 'Đang thi', time: '57 giây' },
      { id: 3, name: 'Nguyễn Ngọc Thanh Vân', status: 'Đang thi', time: '56 giây' },
      { id: 4, name: 'Nguyễn Ngọc Quỳnh Như', status: 'Đang thi', time: '34 giây' },
      { id: 5, name: 'Nguyễn Ngọc Tuyết Nhi', status: 'Đang thi', time: '42 giây' },
      { id: 6, name: 'Anh Thư', status: 'Đang thi', time: '1 phút' },
      { id: 7, name: 'Nguyễn Thanh Giang', status: 'Đang thi', time: '30 giây' },
      { id: 8, name: '26 Đỗ thành tâm 8/7', status: 'Đang thi', time: '1 phút' },
      { id: 9, name: 'Trần Kiều Mi', status: 'Đang thi', time: '35 giây' },
      { id: 10, name: 'Phạm Minh Phước', status: 'Đang thi', time: '44 giây' },
      { id: 11, name: '28.Nguyễn Hoàng Phi', status: 'Đang thi', time: '1 phút' },
      { id: 12, name: 'tống vũ khánh vân', status: 'Đang thi', time: '1 phút' },
    ];
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
    this.examStatusService.disconnect();
  }

  private loadExamDetails() {
    this.examService.getExamById(this.examId).subscribe({
      next: (exam: Exam) => {
        this.examName = exam.title;
        this.className = exam.class?.name || '';
      },
      error: (err: any) => {
        console.error('Error loading exam details:', err);
      }
    });
  }

  private initializeStatusMonitoring() {
    this.statusSubscription = this.examStatusService
      .subscribeToExamStatus(this.examId)
      .subscribe((statuses: ExamStatus[]) => {
        console.log('SessionExamComponent: Received exam statuses:', statuses);
        this.examStatuses = statuses;
      });

    console.log('SessionExamComponent: Requesting initial exam statuses for examId:', this.examId);
    this.examStatusService.getExamStatuses(this.examId);
  }

  getStatusCount(status: ExamStatusType): number {
    return this.examStatuses.filter(s => s.status === status).length;
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

  addActivity(message: string, timestamp: Date) {
    this.activities.unshift({ message, timestamp });
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }
}
