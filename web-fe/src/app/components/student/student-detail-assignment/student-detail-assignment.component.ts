import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AssignmentService } from '../../../services/assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { SubmissionService } from '../../../services/submission.service';

@Component({
  selector: 'app-student-detail-assignment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail-assignment.component.html',
  styleUrl: './student-detail-assignment.component.scss',
  providers: [DatePipe]
})
export class StudentDetailAssignmentComponent implements OnInit {

  assignment: any = {};
  student: any = {};
  userId!: number;
  assignmentId!: number;
  classroom: any = {};
  selectedFile: File | null = null;
  hasSubmitted = false;
  isPastDue = false;
  submission: any = null;


  constructor(
    private userService: UserService,
    private assignmentService: AssignmentService,
    private classService: ClassroomService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private submissionService: SubmissionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.userService.getUserId() ?? 0;
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));

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
        this.assignment.teacherName = response.teacher.fullName;
        this.assignment.totalPoints = response.totalPoints;
        this.assignment.attachment = response.attachment;
        this.getStudentInfo();
        // if (response.classroom) {
        //   this.getClassDetails(response.classId);
        // }
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
      },
      error: (error: any) => {
        console.error('Error checking submission status:', error);
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
    if (confirm('Bạn có chắc chắn muốn hủy nộp bài không?')) {
      this.submissionService.cancelSubmission(this.userId, this.assignmentId).subscribe({
        next: (response) => {
          alert('Đã hủy nộp bài.');
          this.hasSubmitted = false;
          this.submission = null;
        },
        error: (error) => {
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
}

