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
import { ExamCacheService } from '../../../../services/exam-cache.service';

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
  private recentActivityStudents: Set<number> = new Set();

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private examStatusService: ExamStatusService,
    private examService: ExamService,
    private examCacheService: ExamCacheService,
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

    // Khôi phục activity log từ cache trước khi lấy từ server
    this.restoreActivityLogFromCache();

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
        // Thêm sinh viên vào danh sách có hoạt động gần đây
        this.recentActivityStudents.add(activity.studentId);
        // Tự động xóa khỏi danh sách sau 5 phút
        setTimeout(() => {
          this.recentActivityStudents.delete(activity.studentId);
        }, 5 * 60 * 1000);
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

  private restoreActivityLogFromCache(): void {
    const cachedActivities = this.examStatusService.getCachedActivityLog(this.examId, this.classId);
    if (cachedActivities.length > 0) {
      console.log('Khôi phục', cachedActivities.length, 'activity từ cache');
      this.activities = cachedActivities.map(activity => ({
        message: this.getActivityMessage(activity),
        timestamp: new Date(activity.timestamp)
      }));
      
      // Cập nhật danh sách sinh viên có hoạt động gần đây
      cachedActivities.forEach(activity => {
        this.recentActivityStudents.add(activity.studentId);
      });
    }
  }

  fetchActivityLog() {
    this.examStatusService.fetchActivityLog(this.examId, this.classId)
      .subscribe(logs => {
        // Kết hợp logs từ server với cache
        const serverActivities = logs.map(activity => ({
          message: this.getActivityMessage(activity),
          timestamp: new Date(activity.timestamp)
        }));

        // Lấy activities từ cache
        const cachedActivities = this.examStatusService.getCachedActivityLog(this.examId, this.classId);
        const cachedActivityMessages = cachedActivities.map(activity => ({
          message: this.getActivityMessage(activity),
          timestamp: new Date(activity.timestamp)
        }));

        // Kết hợp và loại bỏ trùng lặp
        const allActivities = [...serverActivities, ...cachedActivityMessages];
        const uniqueActivities = this.removeDuplicateActivities(allActivities);
        
        // Sắp xếp theo thời gian mới nhất
        this.activities = uniqueActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Cập nhật cache với dữ liệu mới
        this.examCacheService.setActivityLog(this.examId, this.classId, 
          this.activities.map(activity => ({
            examId: this.examId,
            classId: this.classId,
            studentId: this.extractStudentIdFromMessage(activity.message),
            activityType: this.extractActivityTypeFromMessage(activity.message),
            timestamp: activity.timestamp.toISOString()
          }))
        );
      });
  }

  private removeDuplicateActivities(activities: { message: string; timestamp: Date }[]): { message: string; timestamp: Date }[] {
    const seen = new Set();
    return activities.filter(activity => {
      const key = `${activity.message}_${activity.timestamp.getTime()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private extractStudentIdFromMessage(message: string): number {
    const match = message.match(/sinh viên (\d+)/i);
    return match ? parseInt(match[1]) : 0;
  }

  private extractActivityTypeFromMessage(message: string): string {
    if (message.includes('thoát chế độ toàn màn hình')) {
      return 'FULLSCREEN_EXIT';
    } else if (message.includes('chuyển tab')) {
      return 'TAB_CHANGE';
    } else if (message.includes('rời khỏi trang làm bài')) {
      return 'EXAM_LEFT';
    }
    return 'UNKNOWN';
  }

  // Xóa cache khi kết thúc session exam
  clearExamCache(): void {
    this.examCacheService.clearAllExamCache(this.examId, this.classId);
    console.log('Đã xóa cache cho bài thi:', this.examId, 'lớp:', this.classId);
  }

  // Xóa chỉ cache activity log
  clearActivityCache(): void {
    this.examCacheService.clearActivityLog(this.examId, this.classId);
    this.activities = [];
    this.recentActivityStudents.clear();
    console.log('Đã xóa cache activity log cho bài thi:', this.examId, 'lớp:', this.classId);
  }

  // Làm mới danh sách sinh viên
  refreshStudentList(): void {
    this.examStatusService.getClassStudentsWithExamStatus(this.examId, this.classId);
  }

  // Kiểm tra sinh viên có hoạt động gần đây không
  hasRecentActivity(studentId: number): boolean {
    return this.recentActivityStudents.has(studentId);
  }

  // Lấy class CSS cho activity item
  getActivityClass(activity: any): string {
    const activityType = this.extractActivityTypeFromMessage(activity.message);
    switch (activityType) {
      case 'FULLSCREEN_EXIT':
        return 'activity-warning';
      case 'TAB_CHANGE':
        return 'activity-warning';
      case 'EXAM_LEFT':
        return 'activity-danger';
      default:
        return 'activity-info';
    }
  }

  // Lấy icon cho activity
  getActivityIcon(activity: any): string {
    const activityType = this.extractActivityTypeFromMessage(activity.message);
    switch (activityType) {
      case 'FULLSCREEN_EXIT':
        return 'fas fa-desktop';
      case 'TAB_CHANGE':
        return 'fas fa-window-maximize';
      case 'EXAM_LEFT':
        return 'fas fa-sign-out-alt';
      default:
        return 'fas fa-info-circle';
    }
  }

  // Lấy log hoạt động cho từng sinh viên
  getLogsForStudent(studentId: number) {
    return this.activities
      .filter(log => log.message.includes(`Sinh viên ${studentId} `))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}