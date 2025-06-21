import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ClassroomService } from '../../../services/classroom.service';
import { ClassExamService } from '../../../services/class-exam.service';
import { AssignExamDTO } from '../../../dtos/requests/assign-exam.dto';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports:[
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {
  userId!: number;
  exams: any[] = [];
  classes: any[] = [];
  examId: number = 0;
  selectedClassId: number = 0;
  isPopupVisible: boolean = false;
  assignedDate!: Date;
  dueDate!: Date;
  activeDropdownIndex: number = -1;

  currentPage: number = 0;
  pageSize: number = 9;
  totalElements: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];

  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private examService: ExamService,
    private activedRoute: ActivatedRoute,
    private userService: UserService, 
    private classroomService: ClassroomService,
    private classExamService: ClassExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.userService.getUserId() ?? 0;
    const routeExamId = this.activedRoute.snapshot.paramMap.get('id');
    if (routeExamId) {
      this.examId = Number(routeExamId);
    }
    this.loadAllExams();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadAllExams();
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
    if (this.isPopupVisible) {
      this.loadTeacherClasses();
    }
  }

  openAssignPopup(examId: number) {
    this.examId = examId;
    this.togglePopup();
  }

  loadAllExams() {
    this.examService.getExams(this.userId, this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        debugger
        this.exams = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.updateVisiblePages();
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  updateVisiblePages() {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadAllExams();
  }

  deleteExam(examId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này?')) {
      this.examService.deleteExamById(examId).subscribe({
        next: (response) => {
          this.loadAllExams();
        },
        error: (error) => {
          alert(error.error);
        }
      });
    }
  }

  closePopup(event: any) {
    if (event.target.classList.contains('popup-overlay')) {
      this.isPopupVisible = false;
    }
  }

  loadTeacherClasses() {
    this.classroomService.getClassByTeacher(this.userId).subscribe({
      next: (response) => {
        debugger
        this.classes = response;
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách lớp: ${err.message}`);
      }
    });
  }

  assignExamToClass(examId: number) {
    if (this.selectedClassId === 0) {
      alert('Vui lòng chọn lớp học');
      return;
    }
    
    // Find the exam details
    const exam = this.exams.find(e => e.id === examId);
    if (!exam) {
      alert('Không tìm thấy thông tin bài kiểm tra');
      return;
    }
    
    const assignExamDTO: AssignExamDTO = {
      class_id: this.selectedClassId,
      exam_id: this.examId,
      assigned_date: this.assignedDate,
      due_date: this.dueDate
    };
    
    this.classExamService.assignExamtoClass(assignExamDTO).subscribe({
      next: (response: any) => {
        debugger
        alert('Giao bài kiểm tra thành công!');
        this.isPopupVisible = false;
      },
      error: (error: any) => {
        debugger
        alert(error.error);
      }
    });
  }

  toggleDropdown(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? -1 : index;
  }

  tryExam(examId: number) {
    this.router.navigate(['/try-exam', examId]);
  }

  updateExam(examId: number) {
    this.router.navigate(['/teacher/detail-exam', examId]);
  }

  assignExam(examId: number) {
    this.examId = examId;
    this.togglePopup();
  }
}
