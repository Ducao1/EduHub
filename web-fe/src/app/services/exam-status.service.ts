import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import SockJS from 'sockjs-client';

export enum ExamStatusType {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED'
}

export interface ExamStatus {
  id: number;
  exam: {
    id: number;
    title: string;
  };
  studentId: number;
  student: {
    id: number;
    name: string;
  };
  status: ExamStatusType;
  startTime?: number;
  submitTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamStatusService {
  private stompClient: Client = new Client();
  private statusSubject = new BehaviorSubject<ExamStatus[]>([]);
  private connected = false;

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws`),
      onConnect: () => {
        this.connected = true;
        console.log('Connected to WebSocket');
      },
      onDisconnect: () => {
        this.connected = false;
        console.log('Disconnected from WebSocket');
      }
    });

    this.stompClient.activate();
  }

  subscribeToExamStatus(examId: number): Observable<ExamStatus[]> {
    if (this.connected) {
      console.log(`Subscribing to /topic/exam/${examId}/status`);
      this.stompClient.subscribe(`/topic/exam/${examId}/status`, (message) => {
        console.log('Received message from WebSocket:', message.body);
        try {
          const payload = JSON.parse(message.body);
          console.log('Parsed payload:', payload);

          if (Array.isArray(payload)) {
            // Initial load or full list update
            this.statusSubject.next(payload);
          } else {
            // Single status update
            const currentStatuses = this.statusSubject.getValue();
            const updatedStatuses = currentStatuses.map(status =>
              status.id === payload.id ? payload : status
            );
            // If the payload is a new status (not in the current list), add it
            if (!updatedStatuses.some(status => status.id === payload.id)) {
              updatedStatuses.push(payload);
            }
            this.statusSubject.next(updatedStatuses);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e, 'Message body:', message.body);
        }
      });
    } else {
      console.warn('STOMP client not connected. Cannot subscribe to exam status.');
    }
    return this.statusSubject.asObservable();
  }

  updateStatus(examId: number, studentId: number, status: ExamStatusType) {
    if (this.connected) {
      const messageBody = JSON.stringify({ examId, studentId, status });
      console.log('Publishing update status:', messageBody);
      this.stompClient.publish({
        destination: '/app/exam/status/update',
        body: messageBody
      });
    }
  }

  getExamStatuses(examId: number) {
    if (this.connected) {
      const messageBody = JSON.stringify({ examId });
      console.log('Publishing get exam statuses:', messageBody);
      this.stompClient.publish({
        destination: '/app/exam/status/get',
        body: messageBody
      });
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
} 