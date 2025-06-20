import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../environments/environment';
import { ExamStatusType } from '../dtos/enums/exam-status-type.enum';
import { ExamStatus } from '../interfaces/exam-status';
import { StudentExamStatusDTO } from '../dtos/responses/student-exam-status.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExamStatusService {
  private stompClient: Client | null = null;
  private statusSubject: BehaviorSubject<ExamStatus[]> = new BehaviorSubject<ExamStatus[]>([]);
  private studentStatusSubject: BehaviorSubject<StudentExamStatusDTO[]> = new BehaviorSubject<StudentExamStatusDTO[]>([]);
  private connectionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private readonly reconnectInterval: number = 5000; // 5 seconds
  private pendingStatusUpdates: { examId: number, studentId: number, status: ExamStatusType, classId: number }[] = [];
  private activitySubscriptions: { [key: string]: boolean } = {};

  public statuses$: Observable<ExamStatus[]> = this.statusSubject.asObservable();
  public studentStatuses$: Observable<StudentExamStatusDTO[]> = this.studentStatusSubject.asObservable();
  public connectionStatus$: Observable<boolean> = this.connectionSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        console.log('Kết nối WebSocket thành công');
        this.connectionSubject.next(true);
        this.reconnectAttempts = 0;
        this.processPendingUpdates(); // Xử lý các cập nhật trạng thái đang chờ
      },
      onDisconnect: () => {
        console.log('Ngắt kết nối WebSocket');
        this.connectionSubject.next(false);
        this.attemptReconnect();
      },
      onStompError: (frame) => {
        console.error('Lỗi từ broker: ' + frame.headers['message']);
        console.error('Chi tiết: ' + frame.body);
        this.attemptReconnect();
      },
      debug: (str) => {
        // console.log(new Date(), str); // Uncomment for detailed STOMP debugging
      },
      reconnectDelay: 5000
    });

    this.stompClient.activate();
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Thử kết nối lại lần ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => {
        if (this.stompClient && !this.stompClient.connected) {
          this.stompClient.activate();
        }
      }, this.reconnectInterval);
    } else {
      console.error('Đã đạt số lần thử kết nối lại tối đa');
    }
  }

  private processPendingUpdates() {
    if (this.pendingStatusUpdates.length > 0) {
      this.pendingStatusUpdates.forEach(update => {
        this.stompClient?.publish({
          destination: '/app/exam/status/update',
          body: JSON.stringify({
            examId: update.examId,
            studentId: update.studentId,
            status: update.status,
            classId: update.classId
          }),
        });
      });
      this.pendingStatusUpdates = [];
    }
  }

  private executeWhenConnected(action: () => void) {
    if (this.stompClient && this.stompClient.connected) {
      action();
    } else {
      this.connectionStatus$.pipe(
        filter(connected => connected),
        take(1)
      ).subscribe(() => action());
    }
  }

  updateStatus(examId: number, studentId: number, status: ExamStatusType, classId: number): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/exam/status/update',
        body: JSON.stringify({ examId, studentId, status, classId }),
      });
    } else {
      console.warn('WebSocket chưa kết nối, lưu trạng thái vào hàng đợi');
      this.pendingStatusUpdates.push({ examId, studentId, status, classId });
    }
  }

  getExamStatuses(examId: number): Observable<ExamStatus[]> {
    this.executeWhenConnected(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.publish({
          destination: '/app/exam/status/get',
          body: JSON.stringify({ examId }),
        });
      }
    });
    return this.statuses$;
  }

  getClassStudentsWithExamStatus(examId: number, classId: number): void {
    this.studentStatusSubject.next([]);
    this.executeWhenConnected(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.publish({
          destination: '/app/exam/class/students/status',
          body: JSON.stringify({ examId, classId }),
        });
      }
    });
  }

  private updateLocalStatus(examStatus: ExamStatus): void {
    const currentStatuses = this.statusSubject.value;
    const index = currentStatuses.findIndex(s => s.student?.id === examStatus.student?.id);
    if (index !== -1) {
      currentStatuses[index] = examStatus;
    } else {
      currentStatuses.push(examStatus);
    }
    this.statusSubject.next([...currentStatuses]);
  }

  private updateLocalStudentStatus(studentStatus: StudentExamStatusDTO): void {
    const currentStatuses = this.studentStatusSubject.value;
    const index = currentStatuses.findIndex(s => s.studentId === studentStatus.studentId);
    if (index !== -1) {
      currentStatuses[index] = studentStatus;
    } else {
      currentStatuses.push(studentStatus);
    }
    this.studentStatusSubject.next([...currentStatuses]);
  }

  subscribeToExamStatus(examId: number): Observable<ExamStatus[]> {
    this.executeWhenConnected(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.subscribe(`/topic/exam/${examId}/status`, (message) => {
          const statuses: ExamStatus[] = JSON.parse(message.body);
          this.statusSubject.next(statuses);
        });
      }
    });
    return this.statusSubject.asObservable();
  }

  subscribeToClassStudentsStatus(examId: number, classId: number): void {
    this.studentStatusSubject.next([]);
    this.executeWhenConnected(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.subscribe(`/topic/exam/${examId}/class/${classId}/students`, (message) => {
          const studentStatuses: StudentExamStatusDTO[] = JSON.parse(message.body)
            .map((data: any) => new StudentExamStatusDTO(data));
          this.studentStatusSubject.next(studentStatuses);
        });
      }
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  // Gửi sự kiện hoạt động của sinh viên (chuyển tab, thoát fullscreen, rời trang)
  sendExamActivity(activityType: 'FULLSCREEN_EXIT' | 'TAB_CHANGE' | 'EXAM_LEFT', examId: number, classId: number, studentId: number) {
    const activity = {
      examId,
      classId,
      studentId,
      activityType,
      timestamp: new Date().toISOString()
    };
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/exam/activity',
        body: JSON.stringify(activity)
      });
    }
  }

  /**
   * Đăng ký nhận log hoạt động sinh viên qua WebSocket
   * @param examId
   * @param classId
   * @param callback Hàm xử lý khi nhận được activity
   */
  subscribeToStudentActivityLog(examId: number, classId: number, callback: (activity: any) => void) {
    const topic = `/topic/exam-activity/${examId}/${classId}`;
    if (this.stompClient && this.stompClient.connected) {
      if (!this.activitySubscriptions[topic]) {
        this.stompClient.subscribe(topic, (message: any) => {
          const activity = JSON.parse(message.body);
          callback(activity);
        });
        this.activitySubscriptions[topic] = true;
      }
    } else {
      // Nếu chưa kết nối, đợi kết nối xong rồi subscribe
      this.connectionStatus$.subscribe(connected => {
        if (connected) {
          this.subscribeToStudentActivityLog(examId, classId, callback);
        }
      });
    }
  }

  /**
   * Lấy toàn bộ log hoạt động sinh viên từ backend
   */
  fetchActivityLog(examId: number, classId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/exam-activity?examId=${examId}&classId=${classId}`);
  }
}