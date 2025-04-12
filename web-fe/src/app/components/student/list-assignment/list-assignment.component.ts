import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../../services/assignment.service';
import { StudentNavBarComponent } from '../student-nav-bar/student-nav-bar.component';

@Component({
  selector: 'app-list-assignment',
  imports: [
      CommonModule,
      RouterModule,
      StudentNavBarComponent
  ],
  templateUrl: './list-assignment.component.html',
  styleUrl: './list-assignment.component.scss',
  providers: [DatePipe]
})
export class ListAssignmentComponent {
  classId!: number;
    assignments: any[] = [];
  
    constructor(
      private assignmentService: AssignmentService,
      private route: ActivatedRoute,
      private datePipe: DatePipe
    ) { }
  
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
  
    formatDate(date: string): string {
      return this.datePipe.transform(date, 'HH:mm dd/MM/yyyy') || '';
    }
}
