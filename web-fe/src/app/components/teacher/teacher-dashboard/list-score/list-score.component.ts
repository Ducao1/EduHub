import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../../../../services/submission.service';
import { ActivatedRoute } from '@angular/router';
import { TeacherNavBarComponent } from "../../teacher-nav-bar/teacher-nav-bar.component";
import { AssignmentService } from '../../../../services/assignment.service';
import { ExamService } from '../../../../services/exam.service';

@Component({
  selector: 'app-list-score',
  standalone: true,
  imports: [
    CommonModule,
    TeacherNavBarComponent
],
  templateUrl: './list-score.component.html',
  styleUrl: './list-score.component.scss'
})
export class ListScoreComponent implements OnInit {
  examId!: number;
  submissions: any;
  assignments: { id: number, name: string }[] = [];
  exams: { id: number, name: string }[] = [];
  classId!: number;

  constructor(
    private submissionService: SubmissionService,
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private examService: ExamService
  ) {

  }

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.loadAssignments();
    this.loadExams();
  }

  loadAssignments() {
    this.assignmentService.getAssignmentsByClassId(this.classId, 0, 100).subscribe({
      next: (res) => {
        debugger
        this.assignments = (res.content || res).map((a: any) => ({ id: a.id, name: a.title }));
      },
      error: () => {
        this.assignments = [];
      }
    });
  }

  loadExams() {
    this.examService.getExamsByClassId(this.classId, 0, 100).subscribe({
      next: (res) => {
        debugger
        this.exams = (res.content || res).map((e: any) => ({ id: e.id, name: e.title }));
      },
      error: () => {
        this.exams = [];
      }
    });
  }
}
