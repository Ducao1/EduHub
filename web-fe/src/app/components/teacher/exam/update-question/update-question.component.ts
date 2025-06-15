import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../../services/question.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionDTO } from '../../../../dtos/requests/question.dto';

@Component({
  selector: 'app-update-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './update-question.component.html',
  styleUrl: './update-question.component.scss'
})
export class UpdateQuestionComponent implements OnInit {
  questionDTO: QuestionDTO = {
    question_text: '',
    type: 'MULTI_CHOICE',
    exam_id: 0,
    point: 1,
    answers: []
  };
  examId!: number;
  questionId!: number;
  point!: any;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.questionDTO.point) {
      this.questionDTO.point = 1;
    }
    this.loadQuestionById();
  }

  loadQuestionById() {
    this.questionService.getQuestionById(this.questionId).subscribe({
      next: (response) => {
        debugger;
        this.questionDTO = {
          question_text: response.questionText,
          type: response.type,
          exam_id: response.exam_id,
          point: response.point,
          answers: response.answers.map((answer: any) => ({
            id: answer.id,
            answer_text: answer.answerText,
            is_correct: answer.correct,
            question_id: this.questionId
          }))
        };
        
        this.examId = response.exam_id;
      },
      error: (error) => {
        debugger;
        alert(error.error);
      }
    });
  }

  updateQuestion() {
    this.questionDTO.answers = this.questionDTO.answers.map(answer => ({
      ...answer,
      point: this.point,
      question_id: this.questionId
    }));
    this.questionService.updateQuestion(this.questionId, this.questionDTO).subscribe({
      next: (response) => {
        debugger;
        this.router.navigate(['/teacher/detail-exam', response.exam_id]);
      },
      error: (error) => {
        debugger;
        alert(error.error);
      }
    });
  }
}
