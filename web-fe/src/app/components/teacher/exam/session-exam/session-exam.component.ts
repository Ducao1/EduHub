import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-exam.component.html',
  styleUrl: './session-exam.component.scss',
  providers: [DatePipe]
})
export class SessionExamComponent implements OnInit {
  examName: string = 'Lập trình Web nâng cao';
  className: string = 'CNPM3';
  teacherName: string = 'Cù Việt Dũng';
  timeRemaining: string = '01:30:00'; // Example, will be dynamic
  activities: any[] = [];

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
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
  }

  addActivity(message: string, timestamp: Date) {
    this.activities.push({ message, timestamp });
  }
}
