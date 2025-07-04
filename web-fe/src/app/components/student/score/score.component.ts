import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentNavBarComponent } from "../student-nav-bar/student-nav-bar.component";
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ClassroomService } from '../../../services/classroom.service';

@Component({
  selector: 'app-score',
  imports: [
    CommonModule,
    StudentNavBarComponent
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent implements OnInit {
  classId!: number;
  allTasks: any[] = [];
  studentId!: number;
  className!: string;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private classroomService: ClassroomService
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    const userId = this.userService.getUserId();
    if (typeof userId === 'number') {
      this.studentId = userId;
      this.loadClassInfo();
      this.loadStudentTasks();
    }
  }

  loadClassInfo() {
    this.classroomService.getClassById(this.classId).subscribe({
      next: (response) => {
        this.className = response.name;
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin lớp:', err);
      }
    });
  }

  loadStudentTasks() {
    this.isLoading = true;
    this.userService.getStudentTasksInClass(this.studentId, this.classId).subscribe({
      next: (response) => {
        if (response && response.classTasks && response.classTasks.length > 0) {
          const classTask = response.classTasks[0];
          this.allTasks = [
            ...classTask.assignments.map((assignment: any) => ({
              ...assignment,
              taskType: 'ASSIGNMENT'
            })),
            ...classTask.exams.map((exam: any) => ({
              ...exam,
              taskType: 'EXAM'
            }))
          ];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách bài tập và bài thi:', err);
        this.allTasks = [];
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'NOT_SUBMITTED':
        return 'Chưa nộp';
      case 'SUBMITTED':
        return 'Đã nộp';
      case 'LATE':
        return 'Nộp muộn';
      case 'GRADED':
        return 'Đã chấm điểm';
      default:
        return status;
    }
  }

  getTypeText(type: string): string {
    return type === 'ASSIGNMENT' ? 'Bài tập' : 'Bài thi';
  }
}
