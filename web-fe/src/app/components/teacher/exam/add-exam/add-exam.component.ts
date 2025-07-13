import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../../services/exam.service';
import { ExamDTO } from '../../../../dtos/requests/exam.dto';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-add-exam',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.scss'
})
export class AddExamComponent {
  teacherId!: number;
  title = '';
  examId!: number;
  duration: number = 60;
  notification = {
    show: false,
    type: 'success' as 'success' | 'warning' | 'error',
    message: ''
  };

  constructor(
    private examService: ExamService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.teacherId = this.userService.getUserId() ?? 0;
    console.log('Teacher ID:', this.teacherId);
  }

  addExam() {
    const examDTO: ExamDTO = {
      teacher_id: this.teacherId,
      duration: this.duration,
      title: this.title,
    };
    this.examService.addExam(examDTO).subscribe({
      next: (response) => {
        this.notification = {
          show: true,
          type: 'success',
          message: 'Bài kiểm tra được tạo thành công!'
        };
        this.examId = response.id;
        setTimeout(() => {
          this.notification.show = false;
          this.router.navigate(['/teacher/detail-exam', this.examId]);
        }, 1500);
      },
      complete: () => {
        debugger
      },
      error: (error) => {
        this.notification = {
          show: true,
          type: 'error',
          message: error.error || 'Tạo đề thi thất bại!'
        };
        setTimeout(() => this.notification.show = false, 2000);
      }
    });
  }

  cancel() {
    this.router.navigate(['/teacher/exam']);
  }
}
