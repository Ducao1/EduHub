import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  students: { id: number, name: string, status: string, time: string }[] = [];
  selectedTab: string = 'students';

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

  addActivity(message: string, timestamp: Date) {
    this.activities.push({ message, timestamp });
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }
}
