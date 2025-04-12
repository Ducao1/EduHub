import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../../services/exam.service';
import { ExamDTO } from '../../../../dtos/exam.dto';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-exam',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.scss'
})
export class AddExamComponent {
  teacherId!: number;
  title = '';
  examId!: number;
  duration: number = 60;

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

  addAssignment() {
    const examDTO: ExamDTO = {
      teacher_id: this.teacherId,
      duration: this.duration,
      title: this.title,
    };
    this.examService.addExam(examDTO).subscribe({
      next: (response) => {
        debugger
        alert('Bài kiểm tra được tạo thành công!');
        this.examId = response.id;
        this.router.navigate(['/teacher/detail-exam', this.examId]);
      },
      complete: () => {
        debugger
      },
      error: (error) => {
        debugger
        alert(error.error)
      }
    });
  }

}
