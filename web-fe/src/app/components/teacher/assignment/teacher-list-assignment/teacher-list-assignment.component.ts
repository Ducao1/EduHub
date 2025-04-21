import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-teacher-list-assignment',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './teacher-list-assignment.component.html',
  styleUrl: './teacher-list-assignment.component.scss',
  providers: [DatePipe]
})
export class TeacherListAssignmentComponent {
  assignments: any[] = [];
  teacherId!: number;

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.teacherId = this.userService.getUserId() ?? 0;
    this.loadAssignments();
  }

  loadAssignments() {
    this.assignmentService.getAssignmentsByTeacherId(this.teacherId).subscribe({
      next: (response) => {
        debugger
        this.assignments = response;
      },
      error: (err) => {
        debugger
        alert(`Lỗi khi lấy danh sách bài tập: ${err.error}`);
      }
    });
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const jsDate = new Date(year, month - 1, day, hour, minute, second);
    return this.datePipe.transform(jsDate, 'HH:mm dd/MM/yyyy') || '';
  }
  
}
