import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';
import SockJS from 'sockjs-client';
import { environment } from '../environments/environment';
import { ExamStatusType } from '../dtos/enums/exam-status-type.enum';
import { ExamStatus } from '../interfaces/exam-status';
import { StudentExamStatusDTO } from '../dtos/responses/student-exam-status.dto';

@Injectable({
  providedIn: 'root',
})
export class ExamStatusService {
  private stompClient: Client | null = null;
  private statusSubject: BehaviorSubject<ExamStatus[]> = new BehaviorSubject<ExamStatus[]>([]);
  private studentStatusSubject: BehaviorSubject<StudentExamStatusDTO[]> = new BehaviorSubject<StudentExamStatusDTO[]>([]);
  private connectionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public statuses$: Observable<ExamStatus[]> = this.statusSubject.asObservable();
  public studentStatuses$: Observable<StudentExamStatusDTO[]> = this.studentStatusSubject.asObservable();
  public connectionStatus$: Observable<boolean> = this.connectionSubject.asObservable();

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.connectionSubject.next(true);
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        this.connectionSubject.next(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      debug: (str) => {
        // console.log(new Date(), str); // Uncomment for detailed STOMP debugging
      }
    });

    this.stompClient.activate();
  }

  // Cập nhật trạng thái bài thi
  updateStatus(examId: number, studentId: number, status: ExamStatusType): void {
    this.connectionStatus$.pipe(filter(connected => connected), take(1)).subscribe(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.publish({
          destination: '/app/exam/status/update',
          body: JSON.stringify({ examId, studentId, status }),
        });
      }
    });
  }

  // Lấy danh sách trạng thái của bài thi
  getExamStatuses(examId: number): Observable<ExamStatus[]> {
    this.connectionStatus$.pipe(filter(connected => connected), take(1)).subscribe(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.publish({
          destination: '/app/exam/status/get',
          body: JSON.stringify({ examId }),
        });
      }
    });
    return this.statuses$;
  }

  // Lấy danh sách sinh viên và trạng thái bài thi trong lớp
  getClassStudentsWithExamStatus(examId: number, classId: number): void {
    this.connectionStatus$.pipe(filter(connected => connected), take(1)).subscribe(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.publish({
          destination: '/app/exam/class/students/status',
          body: JSON.stringify({ examId, classId }),
        });
      }
    });
  }

  // Cập nhật trạng thái cục bộ
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

  // Cập nhật trạng thái sinh viên cục bộ
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

  // Đăng ký nhận cập nhật trạng thái bài thi
  subscribeToExamStatus(examId: number): Observable<ExamStatus[]> {
    this.connectionStatus$.pipe(filter(connected => connected), take(1)).subscribe(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.subscribe(`/topic/exam/${examId}/status`, (message) => {
          const statuses: ExamStatus[] = JSON.parse(message.body);
          this.statusSubject.next(statuses);
        });
      }
    });
    return this.statusSubject.asObservable();
  }

  // Đăng ký nhận cập nhật trạng thái sinh viên trong lớp
  subscribeToClassStudentsStatus(examId: number, classId: number): void {
    this.connectionStatus$.pipe(filter(connected => connected), take(1)).subscribe(() => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.subscribe(`/topic/exam/${examId}/class/${classId}/students`, (message) => {
          const studentStatuses: StudentExamStatusDTO[] = JSON.parse(message.body)
            .map((data: any) => new StudentExamStatusDTO(data));
          this.studentStatusSubject.next(studentStatuses);
        });
      }
    });
  }

  // Ngắt kết nối WebSocket
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}