import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AssignmentService } from '../../../services/assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { SubmissionService } from '../../../services/submission.service';
import { StudentNavBarComponent } from "../student-nav-bar/student-nav-bar.component";
import { ScoreService } from '../../../services/score.service';

@Component({
  selector: 'app-student-detail-assignment',
  standalone: true,
  imports: [CommonModule, StudentNavBarComponent],
  templateUrl: './student-detail-assignment.component.html',
  styleUrl: './student-detail-assignment.component.scss',
  providers: [DatePipe]
})
export class StudentDetailAssignmentComponent implements OnInit {
  classId!: number;
  assignment: any = {};
  student: any = {};
  userId!: number;
  assignmentId!: number;
  classroom: any = {};
  selectedFile: File | null = null;
  hasSubmitted = false;
  isPastDue = false;
  submission: any = null;
  score: number | null = null;


  constructor(
    private userService: UserService,
    private assignmentService: AssignmentService,
    private classService: ClassroomService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private submissionService: SubmissionService,
    private router: Router,
    private scoreService: ScoreService
  ) { }

  ngOnInit() {
    this.userId = this.userService.getUserId() ?? 0;
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));

    if (this.assignmentId) {
      this.getAssignmentDetails(this.assignmentId);
    }

    this.checkSubmissionStatus();
  }

  getAssignmentDetails(assignmentId: number) {
    this.assignmentService.getAssignmentById(assignmentId).subscribe({
      next: (response) => {
        debugger
        this.assignment = response;
        this.classId = response.classId;
        this.getStudentInfo();
        this.checkDeadline();
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  checkSubmissionStatus() {
    this.submissionService.getStudentSubmissionStatus(this.userId, this.assignmentId).subscribe({
      next: (response: any) => {
        this.hasSubmitted = response.hasSubmitted;
        this.submission = response.submission;
        if (this.hasSubmitted && this.submission?.id) {
          this.loadScore(this.submission.id);
        } else {
          this.score = null;
        }
      },
      error: (error: any) => {
        console.error('Error checking submission status:', error);
      }
    });
  }

  loadScore(submissionId: number) {
    this.scoreService.getScoreBySubmissionId(submissionId).subscribe({
      next: (res: any) => {
        debugger
        this.score = res?.score ?? null;
      },
      error: (err: any) => {
        debugger
        this.score = null;
        console.error(err);
      }
    });
  }

  getStudentInfo() {
    this.userService.getStudentById(this.userId).subscribe({
      next: (response) => {
        debugger
        this.student = response;
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  submitAssignment(): void {
    if (!this.selectedFile) {
      alert('Vui lòng chọn một file để nộp.');
      return;
    }

    this.submissionService.submitAssignment(this.userId, this.assignmentId, this.selectedFile).subscribe({
      next: (response) => {
        alert('Nộp bài thành công!');
        this.checkSubmissionStatus();
      },
      error: (error) => {
        alert(`Lỗi khi nộp bài: ${error.error}`);
      }
    });
  }

  cancelSubmission() {
    if (this.score !== null) {
      alert('Bài đã được chấm điểm, không thể hủy nộp bài!');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn hủy nộp bài không?')) {
      this.submissionService.cancelSubmission(this.userId, this.assignmentId).subscribe({
        next: (response) => {
          debugger
          alert('Đã hủy nộp bài.');
          this.hasSubmitted = false;
          this.submission = null;
        },
        error: (error) => {
          debugger
          alert(`Lỗi khi hủy nộp bài: ${error.error}`);
        }
      });
    }
  }

  checkDeadline() {
    if (this.assignment.dueDate) {
      const dueDate = new Date(this.assignment.dueDate[0], this.assignment.dueDate[1] - 1, this.assignment.dueDate[2], this.assignment.dueDate[3], this.assignment.dueDate[4], this.assignment.dueDate[5]);
      this.isPastDue = new Date() > dueDate;
    }
  }

  formatDate(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 3) {
      return '';
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return this.datePipe.transform(date, 'HH:mm, dd/MM/yyyy') || '';
  }

  getOriginalFileName(fileName: string): string {
    if (!fileName) {
      return '';
    }
    const parts = fileName.split('_');
    if (parts.length > 1) {
      parts.shift();
      return parts.join('_');
    }
    return fileName;
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filePath);
  }

  getAttachmentUrl(filePath: string): string {
    const filename = filePath.split(/[\\/]/).pop();
    return `http://localhost:8080/uploads/${filename}`;
  }
}

