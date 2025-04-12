import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ClassroomService } from '../../../../services/classroom.service';
import { SubmissionService } from '../../../../services/submission.service';
import { UserService } from '../../../../services/user.service';
import { EnrollmentService } from '../../../../services/enrollment.service';

@Component({
  selector: 'app-detail-assignment',
  imports: [
    CommonModule
  ],
  templateUrl: './detail-assignment.component.html',
  styleUrl: './detail-assignment.component.scss',
  providers: [DatePipe]
})
export class DetailAssignmentComponent {
  assignment: any = {};
  student: any = {};
  classroom: any = {};
  teacherId!: number;
  assignmentId!: number;
  classId!: number;
  students: any[] = [];
  hasSubmitted: Map<number, boolean> = new Map();


  constructor(
    private userService: UserService,
    private assignmentService: AssignmentService,
    private classService: ClassroomService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private submissionService: SubmissionService,
    private router: Router,
    private enrollmentService: EnrollmentService,
  ) { }

  ngOnInit() {
    this.teacherId = this.userService.getUserId() ?? 0;
    this.assignmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.assignmentId) {
      this.getAssignmentDetails(this.assignmentId);
    }
  }

  getAssignmentDetails(assignmentId: number) {
    this.assignmentService.getAssignmentById(assignmentId).subscribe({
      next: (response) => {
        debugger
        this.assignment = response;
        if (response.classroom) {
          this.classId = response.classroom.id;
          this.getClassDetails(this.classId);
          this.loadAllStudent(this.classId);
          this.checkSubmissionStatus(this.classId, this.assignmentId);
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
        debugger
        this.classroom = response;
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  loadAllStudent(classId: number) {
    this.enrollmentService.getAllStudentInClass(classId).subscribe({
      next: (response) => {
        debugger
        this.students = response;
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    })
  }

  checkSubmissionStatus(classId: number, assignmentId: number) {
    this.submissionService.getClassSubmissionStatus(classId, assignmentId).subscribe({
      next: (response) => {
        debugger
        this.students.forEach(student => {
          this.hasSubmitted.set(student.id, false);
        });
        
        response.forEach((submission: { studentId: number; submitted: boolean }) => {
          this.hasSubmitted.set(submission.studentId, submission.submitted);
        });
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'HH:mm dd/MM/yyyy') || '';
  }
}
