import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { ClassroomService } from '../../../../services/classroom.service';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { SubmissionService } from '../../../../services/submission.service';
import { UserService } from '../../../../services/user.service';
import { TeacherNavBarComponent } from '../../teacher-nav-bar/teacher-nav-bar.component';

@Component({
  selector: 'app-list-submission-assignment',
  imports: [
    CommonModule,
    FormsModule,
    TeacherNavBarComponent
  ],
  templateUrl: './list-submission-assignment.component.html',
  styleUrl: './list-submission-assignment.component.scss',
  providers: [DatePipe]
})
export class ListSubmissionAssignmentComponent {
  assignment: any = {};
  student: any = {};
  classroom: any = {};
  teacherId!: number;
  assignmentId!: number;
  classId!: number;
  students: any[] = [];
  className: string = '';
  hasSubmitted: Map<number, boolean> = new Map();

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  visiblePages: number[] = [];

  searchTerm: string = '';
  filteredStudents: any[] = [];
  paginatedStudents: any[] = [];

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
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));

    if (this.assignmentId) {
      this.getAssignmentDetails(this.assignmentId);
    }
  }

  getAssignmentDetails(assignmentId: number) {
    this.assignmentService.getAssignmentById(assignmentId).subscribe({
      next: (response) => {
        debugger
        this.assignment = response;
        if (response) {
          this.className = response.className;
          this.classId = response.classId;
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
        this.filteredStudents = [...this.students];
        this.updatePagination();
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

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }

  filterStudents() {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize);
    this.calculateVisiblePages();
    this.updatePaginatedStudents();
  }

  calculateVisiblePages() {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  updatePaginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePaginatedStudents();
      this.calculateVisiblePages();
    }
  }

  viewSubmission(studentId: number) {
    this.router.navigate(['/teacher/assignment', this.assignmentId, 'submission', studentId]);
  }

  isImage(filePath: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filePath);
  }

  getAttachmentUrl(filePath: string): string {
    const filename = filePath.split(/[\\/]/).pop();
    return `http://localhost:8080/uploads/${filename}`;
  }
}
