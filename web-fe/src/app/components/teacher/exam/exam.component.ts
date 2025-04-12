import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ClassroomService } from '../../../services/classroom.service';
import { ClassExamService } from '../../../services/class-exam.service';
import { AssignExamDTO } from '../../../dtos/assign-exam.dto';

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
export class ExamComponent {
  userId!:number;
  exams : any[] = [];
  classes : any[] = [];
  examId: number = 0;
  selectedClassId: number = 0;
  isPopupVisible: boolean = false;
  assignedDate!: Date;
  dueDate!: Date;

  constructor(
    private examService: ExamService,
    private activedRoute: ActivatedRoute,
    private userService: UserService, 
    private classroomService: ClassroomService,
    private classExamService: ClassExamService
  ){

  }

  ngOnInit(){
    this.userId = this.userService.getUserId() ?? 0;
    const routeExamId = this.activedRoute.snapshot.paramMap.get('id');
    if (routeExamId) {
      this.examId = Number(routeExamId);
    }
    this.loadAllExams();
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
    this.examService.getExams(this.userId).subscribe({
      next: (response) => {
        debugger
        this.exams = response;
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    })
  }

  deleteExam(id: number) {
    if (confirm("Bạn có chắc muốn xóa đề thi này?")) {
      this.examService.deleteExamById(id).subscribe({
        next: (response) => {
          debugger
          this.loadAllExams();
        },
        error: (error) => {
          debugger
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
    debugger
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
    
    // Call the ClassExamService to assign the exam to the class
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
}
