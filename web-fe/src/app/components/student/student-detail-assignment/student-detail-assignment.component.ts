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
  hasSubmitted: boolean = false;
  submittedFile: File | null = null;


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
        this.assignment = response;
        this.getStudentInfo();
        if (response.classroom) {
          this.getClassDetails(response.classroom.id);
        }
        this.checkDeadline();
        this.checkSubmissionStatus();
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }

  checkSubmissionStatus() {
    this.submissionService.getStudentSubmissionStatus(this.userId, this.assignmentId).subscribe({
      next: (response) => {
        this.hasSubmitted = response.submitted;
        if (response.fileName) {
          this.submittedFile = { name: response.fileName } as File;
        }
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }


  getClassDetails(classId: number) {
    this.classService.getClassById(classId).subscribe({
      next: (response) => {
        this.classroom = response;
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }

  getStudentInfo() {
    this.userService.getStudentById(this.userId).subscribe({
      next: (response) => {
        this.student = response;
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("File đã chọn:", file.name);
    }
  }

  submitAssignment() {
    if (!this.selectedFile) {
      alert("Vui lòng chọn file trước khi nộp bài!");
      return;
    }

    this.submissionService.submitAssignment(this.userId, this.assignmentId, this.selectedFile).subscribe({
      next: () => {
        alert("Nộp bài thành công!");
        this.hasSubmitted = true;
        this.submittedFile = this.selectedFile;
        this.selectedFile = null;
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }

  cancelSubmission() {
    this.submissionService.cancelSubmission(this.userId, this.assignmentId).subscribe({
      next: () => {
        alert("Hủy nộp bài thành công!");
        this.hasSubmitted = false;
        this.submittedFile = null;
      },
      error: (error) => {
        alert(error.error?.message || "Lỗi khi hủy nộp bài!");
      }
    });
  }

  checkDeadline() {
    if (!this.assignment?.dueDate) {
      this.assignment.isExpired = false;
      return;
    }

    const now = new Date();
    const dueDate = new Date(this.assignment.dueDate);
    this.assignment.isExpired = now > dueDate;
  }


  formatDate(date: string): string {
    return this.datePipe.transform(date, 'HH:mm dd/MM/yyyy') || '';
  }
}

