import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClassroomService } from '../../../../services/classroom.service';
import { UserService } from '../../../../services/user.service';
import { EnrollmentService } from '../../../../services/enrollment.service';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-list-class',
  imports: [
    CommonModule,
    RouterModule,
    NotificationComponent
  ],
  templateUrl: './list-class.component.html',
  styleUrl: './list-class.component.scss'
})
export class ListClassComponent {
  userId!: number;
  classes: any[]=[];
  openDropdownIndex: number|null = null;
  isDeleteConfirmVisible: boolean = false;
  deleteClassId: number|null = null;
  deleteClassName: string = '';
  notification: { type: 'success' | 'warning' | 'error', message: string } | null = null;
  constructor(
    private classroomService: ClassroomService,
    private userService : UserService,
    private enrollmentService: EnrollmentService
  ){}
  ngOnInit(): void {
    this.userId = this.userService.getUserId() ?? 0;
    this.loadAllClassByTeacher();
    
  }

  cardBackgrounds: string[] = [
    '#eef2f7',
    '#ffffff',
    '#e6f3ff',
    '#f8f9fa',
    '#e9ecef',
    '#cfe6ff'
  ];

  cardTextColors: string[] = [
    '#0052B4',
    '#4a5fd1',
    '#007bff',
    '#6c757d',
    '#343a40',
    '#0056b3' 
  ];

  getCardBackground(index: number): string {
    return '#ffffff';
  }

  getCardTitleColor(index: number): string {
    return '#343a40';
  }

  loadAllClassByTeacher() {
    this.classroomService.getClassByTeacher(this.userId).subscribe({
      next: (response) => {
        this.classes = response.map((c: any) => ({ ...c, studentCount: null }));
        this.classes.forEach((c: any, index: number) => {
          this.enrollmentService.getAllStudentInClass(c.id).subscribe({
            next: (students) => {
              this.classes[index].studentCount = students.length;
            },
            error: () => {
              this.classes[index].studentCount = 0;
            }
          });
        });
      },
      error: (error) => {
        alert(error.error);
      }
    });
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  handleUpdate(classItem: any) {
    alert('Chức năng cập nhật lớp đang phát triển!');
    this.openDropdownIndex = null;
  }

  handleDelete(classItem: any) {
    this.deleteClassId = classItem.id;
    this.deleteClassName = classItem.name;
    this.isDeleteConfirmVisible = true;
    this.openDropdownIndex = null;
  }

  confirmDeleteClass() {
    if (this.deleteClassId != null) {
      this.classroomService.deleteClassroom(this.deleteClassId).subscribe({
        next: (res: any) => {
          this.isDeleteConfirmVisible = false;
          this.deleteClassId = null;
          this.deleteClassName = '';
          this.notification = { type: 'success', message: 'Xóa lớp thành công!' };
          setTimeout(() => this.notification = null, 3000);
          this.loadAllClassByTeacher();
        },
        error: (err: any) => {
          this.isDeleteConfirmVisible = false;
          this.deleteClassId = null;
          this.deleteClassName = '';
          this.notification = { type: 'error', message: err.error || 'Xóa lớp thất bại!' };
          setTimeout(() => this.notification = null, 3000);
        }
      });
    }
  }

  cancelDeleteClass() {
    this.isDeleteConfirmVisible = false;
    this.deleteClassId = null;
    this.deleteClassName = '';
  }

  onNotificationClose() {
    this.notification = null;
  }
}
