import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StudentNavBarComponent } from '../student-nav-bar/student-nav-bar.component';
import { ClassExamService } from '../../../services/class-exam.service';

@Component({
  selector: 'app-list-exam',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule,
      StudentNavBarComponent
  ],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.scss',
  providers: [DatePipe]
})
export class ListExamComponent {
  classId!: number;
  exams: any[] = [];
  
    constructor(
      private classExamService: ClassExamService,
      private route: ActivatedRoute,
      private datePipe: DatePipe
    ) { }
  
    ngOnInit() {
      this.classId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadExams();
    }
  
    loadExams() {
      this.classExamService.getExamByClass(this.classId).subscribe({
        next: (response) => {
          debugger
          this.exams = response;
        },
        error: (err) => {
          debugger
          alert(err.error);
        }
      });
    }
  
    formatDate(date: string): string {
      return this.datePipe.transform(date, 'HH:mm dd/MM/yyyy') || '';
    }
}
