import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { User } from '../../../../interfaces/user';
import { ClassroomService } from '../../../../services/classroom.service';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent,
    FormsModule
],
  templateUrl: './list-student.component.html',
  styleUrl: './list-student.component.scss'
})
export class ListStudentComponent implements OnInit {
  classId!: number;
  className!: string;
  students: User[] = [];
  paginatedStudents: User[] = [];
  
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];
  isPopupVisible: boolean = false;
  pendingStudents: User[] = [];

  studentList: any[] = [];
    searchTerm: string = '';
    private searchSubject = new Subject<string>();

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private classroomService: ClassroomService
  ) { }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.loadClassInfo();
    this.loadAllStudent();
      this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
        if (term && term.trim() !== '') {
          this.searchStudentsInClass(term);
        } else {
          this.loadAllStudent();
        }
      });
  }

  loadClassInfo() {
    this.classroomService.getClassById(this.classId).subscribe({
      next: (response) => {
        debugger
        this.className = response.name;
      },
      error: (err) => {
        debugger
        console.error('Lỗi khi lấy thông tin lớp:', err);
      }
    });
  }

  loadAllStudent() {
    this.enrollmentService.getAllStudentInClass(this.classId).subscribe({
      next: (response) => {
        debugger
        this.students = response;
        this.totalPages = Math.ceil(this.students.length / this.pageSize);
        this.updatePaginatedStudents();
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách sinh viên: ${err.message}`);
      }
    })
  }

  updatePaginatedStudents(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStudents = this.students.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePaginatedStudents();
    this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
  }

  

  exportExcel() {
    const className = this.className ? this.className.replace(/[^a-zA-Z0-9_-]/g, '_') : this.classId;
    this.enrollmentService.exportStudentsInClassToExcel(this.classId).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `list_student_${className}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onSearchInput(term: string) {
      this.searchSubject.next(term.trim());
    }
  
    searchStudentsInClass(term: string) {
      this.enrollmentService.searchStudentsInClass(this.classId, term).subscribe({
        next: (res) => {
          this.studentList = res;
        },
        error: (err) => {
          this.studentList = [];
        }
      });
    }

  approveAll() {
    this.enrollmentService.approveAllPendingStudents(this.classId).subscribe({
      next: () => {
        debugger
        this.pendingStudents = [];
      },
      error: () => {}
    });
  }

  approveStudent(student: User) {
    this.enrollmentService.approveStudent(student.id).subscribe({
      next: () => {
        debugger
        this.pendingStudents = this.pendingStudents.filter(s => s.id !== student.id);
      },
      error: () => {}
    });
  }

  onApprove() {
    this.togglePopup();
  }

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
    if (this.isPopupVisible) {
      this.enrollmentService.getPendingStudentsInClass(this.classId).subscribe({
        next: (res) => {
          debugger
          this.pendingStudents = res;
        },
        error: (err) => {
          debugger
          this.pendingStudents = [];
        }
      });
    } else {
      window.location.reload();
    }
  }

  openApprovePopup(classId: number) {
    this.togglePopup();
  }

  closePopup(event: any) {
    if (event.target.classList.contains('popup-overlay')) {
      this.isPopupVisible = false;
    }
  }
}