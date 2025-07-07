import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../services/submission.service';
import { UserService } from '../../../../services/user.service';
import { ScoreService } from '../../../../services/score.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './detail-assignment.component.html',
  styleUrl: './detail-assignment.component.scss',
  providers: [DatePipe]
})
export class DetailAssignmentComponent implements OnInit {
  assignmentId!: number;
  studentId!: number;
  student: any;
  submission: any;
  fileUrl: string = '';
  grade: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private userService: UserService,
    private scoreService: ScoreService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.assignmentId = +this.route.snapshot.paramMap.get('assignmentId')!;
    this.studentId = +this.route.snapshot.paramMap.get('studentId')!;
    this.loadStudent();
    this.loadSubmission();
  }

  loadStudent() {
    debugger
    this.userService.getStudentById(this.studentId).subscribe(res => {
      this.student = res;
    });
  }

  loadSubmission() {
    this.submissionService.getStudentSubmissionStatus(this.studentId, this.assignmentId).subscribe(res => {
      if (res.hasSubmitted) {
        debugger
        this.submission = res.submission;
        this.fileUrl = `http://localhost:8080/api/submissions/files/${this.submission.file}`;
        this.loadScore();
      }
    });
  }

  loadScore() {
    debugger
    if (!this.submission?.id) return;
    this.scoreService.getScoreBySubmissionId(this.submission.id).subscribe(res => {
      if (res) this.grade = res.score;
    });
  }

  saveGrade() {
    if (!this.submission?.id) return;
    const teacherId = this.userService.getUserId();
    const scoreDTO = {
      submission_id: this.submission.id,
      graded_by_id: teacherId,
      total_score: this.grade
    };
    this.scoreService.gradeSubmission(scoreDTO).subscribe({
      next: () => {
        debugger
        alert('Lưu điểm thành công!');
        this.loadScore();
      },
      error: () => {
        debugger
        alert('Lỗi khi lưu điểm!');
      }
    });
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }

  getOriginalFileName(fileName: string): string {
    if (!fileName) return '';
    const index = fileName.indexOf('_');
    if (index === -1) return fileName;
    return fileName.substring(index + 1);
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filePath);
  }

  getAttachmentUrl(filePath: string): string {
    const filename = filePath.split(/[\\/]/).pop();
    return `http://localhost:8080/uploads/${filename}`;
  }

}
