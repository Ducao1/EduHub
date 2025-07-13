import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { User } from '../../../../interfaces/user';
import { ClassroomService } from '../../../../services/classroom.service';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../../notification/notification.component';
import { Router } from '@angular/router';
import { ScoreService } from '../../../../services/score.service';

@Component({
  selector: 'app-list-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent,
    FormsModule,
    NotificationComponent
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

  activeDropdownIndex: number = -1;
  showNotification: boolean = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage: string = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private router: Router,
    private scoreService: ScoreService
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.activeDropdownIndex !== -1) {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        this.closeDropdown();
      }
    }
  }

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
        this.showNotificationMessage('error', `Lỗi khi lấy danh sách sinh viên: ${err.message}`);
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
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  exportListStudent() {
    const className = this.className ? this.className.replace(/[^a-zA-Z0-9_-]/g, '_') : this.classId;
    this.enrollmentService.exportStudentsInClassToExcel(this.classId).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `list_student_${className}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.showNotificationMessage('success', 'Xuất Excel thành công!');
    });
  }

  exportListScore(){
    const className = this.className ? this.className.replace(/[^a-zA-Z0-9_-]/g, '_') : this.classId;
    this.scoreService.exportStudentScoresByClassId(this.classId).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_scores_${className}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.showNotificationMessage('success', 'Xuất báo cáo điểm thành công!');
    }, (error) => {
      this.showNotificationMessage('error', 'Lỗi khi xuất báo cáo điểm');
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
        this.showNotificationMessage('success', 'Đã duyệt tất cả sinh viên thành công!');
      },
      error: (err) => {
        this.showNotificationMessage('error', 'Lỗi khi duyệt sinh viên');
      }
    });
  }

  approveStudent(student: any) {
    this.enrollmentService.approveStudent(student.enrollmentId).subscribe({
      next: () => {
        this.pendingStudents = this.pendingStudents.filter(s => s.enrollmentId !== student.enrollmentId);
        this.showNotificationMessage('success', `Đã duyệt sinh viên ${student.fullName} thành công!`);
      },
      error: (err) => {
        this.showNotificationMessage('error', 'Lỗi khi duyệt sinh viên');
      }
    });
  }

  toggleDropdown(index: number, event: Event) {
    event.stopPropagation();
    this.activeDropdownIndex = this.activeDropdownIndex === index ? -1 : index;
  }

  closeDropdown() {
    this.activeDropdownIndex = -1;
  }

  followStudent(student: User) {
    console.log('Theo dõi sinh viên:', student.fullName);
    this.router.navigate(['/teacher/class', this.classId, 'student', student.id]);
    this.closeDropdown();
  }

  removeStudentFromClass(studentId: number, studentName: string) {
    if (confirm(`Bạn có chắc chắn muốn xóa sinh viên "${studentName}" khỏi lớp học này?`)) {
      this.enrollmentService.removeStudentFromClass(this.classId, studentId).subscribe({
        next: (response) => {
          this.showNotificationMessage('success', `Đã xóa sinh viên "${studentName}" khỏi lớp thành công!`);
          this.loadAllStudent();
        },
        error: (error) => {
          this.showNotificationMessage('error', `Lỗi khi xóa sinh viên: ${error.error?.message || error.message}`);
        }
      });
    }
    this.closeDropdown();
  }

  showNotificationMessage(type: 'success' | 'warning' | 'error', message: string) {
    this.notificationType = type;
    this.notificationMessage = message;
    this.showNotification = true;
    
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification() {
    this.showNotification = false;
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