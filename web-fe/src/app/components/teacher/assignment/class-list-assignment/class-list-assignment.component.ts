import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../../services/assignment.service';
import { TeacherNavBarComponent } from '../../teacher-nav-bar/teacher-nav-bar.component';

@Component({
  selector: 'app-class-list-assignment',
  imports: [
    CommonModule,
    RouterModule,
    TeacherNavBarComponent
  ],
  templateUrl: './class-list-assignment.component.html',
  styleUrl: './class-list-assignment.component.scss',
  providers: [DatePipe]
})
export class ClassListAssignmentComponent {
  assignments: any[] = [];
  classId!: number;

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAssignments();
  }

  loadAssignments() {
    this.assignmentService.getAssignmentsByClassId(this.classId).subscribe({
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
