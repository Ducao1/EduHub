import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentNavBarComponent } from "../student-nav-bar/student-nav-bar.component";
import { ActivatedRoute } from '@angular/router';
import { ScoreService } from '../../../services/score.service';
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
  assignmentScores: any[] = [];
  examScores: any[] = [];
  studentId!: number;
  className!: string;

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreService,
    private userService: UserService,
    private classroomService: ClassroomService
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    const userId = this.userService.getUserId();
    if (typeof userId === 'number') {
      this.studentId = userId;
      this.loadClassInfo();
      this.loadAssignmentScores();
      this.loadExamScores();
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

  loadAssignmentScores() {
    this.scoreService.getAssignmentScoresByStudentId(this.studentId).subscribe({
      next: (res) => this.assignmentScores = res,
      error: () => this.assignmentScores = []
    });
  }

  loadExamScores() {
    this.scoreService.getExamScoresByStudentId(this.studentId).subscribe({
      next: (res) => this.examScores = res,
      error: () => this.examScores = []
    });
  }
}
