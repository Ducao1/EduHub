import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../../services/question.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionDTO } from '../../../../dtos/requests/question.dto';
import { NotificationComponent } from '../../../notification/notification.component';

@Component({
  selector: 'app-update-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
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
  selectedAnswerIndex: number = 0;
  notificationMessage: string = '';
  notificationType: 'success' | 'warning' | 'error' = 'success';

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
          answers: response.answers.map((answer: any, idx: number) => ({
            id: answer.id,
            answer_text: answer.answerText,
            is_correct: answer.correct,
            question_id: this.questionId
          }))
        };
        
        this.examId = response.exam_id;
        // Set selectedAnswerIndex for SINGLE_CHOICE
        if (this.questionDTO.type === 'SINGLE_CHOICE') {
          const idx = this.questionDTO.answers.findIndex(a => a.is_correct);
          this.selectedAnswerIndex = idx !== -1 ? idx : 0;
        }
      },
      error: (error) => {
        debugger;
        alert(error.error);
      }
    });
  }

  updateQuestion() {
    // Đồng bộ đáp án đúng cho SINGLE_CHOICE
    if (this.questionDTO.type === 'SINGLE_CHOICE') {
      this.questionDTO.answers.forEach((a, idx) => a.is_correct = idx === this.selectedAnswerIndex);
    }
    this.questionDTO.answers = this.questionDTO.answers.map(answer => ({
      ...answer,
      point: this.point,
      question_id: this.questionId
    }));
    this.questionService.updateQuestion(this.questionId, this.questionDTO).subscribe({
      next: (response) => {
        this.showNotification('Cập nhật câu hỏi thành công!', 'success');
        setTimeout(() => {
          this.notificationMessage = '';
          this.router.navigate(['/teacher/detail-exam', response.exam_id]);
        }, 1500);
      },
      error: (error) => {
        this.showNotification(error?.error?.error || 'Cập nhật thất bại', 'error');
        setTimeout(() => this.notificationMessage = '', 3000);
      }
    });
  }

  showNotification(message: string, type: 'success' | 'warning' | 'error' = 'success') {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  closeNotification() {
    this.notificationMessage = '';
  }

  isValidQuestion(): boolean {
    if (this.questionDTO.type === 'SINGLE_CHOICE') {
      return this.questionDTO.answers.some(a => a.is_correct);
    }
    if (this.questionDTO.type === 'MULTI_CHOICE') {
      return this.questionDTO.answers.some(a => a.is_correct);
    }
    if (this.questionDTO.type === 'ESSAY') {
      return !!(this.questionDTO.answers[0] && this.questionDTO.answers[0].answer_text);
    }
    return false;
  }

  addAnswer() {
    if (this.questionDTO.type === 'SINGLE_CHOICE') {
      this.questionDTO.answers.push({ answer_text: '', is_correct: false, question_id: this.questionId });
    } else if (this.questionDTO.type === 'MULTI_CHOICE') {
      this.questionDTO.answers.push({ answer_text: '', is_correct: false, question_id: this.questionId });
    }
  }

  cancel() {
    this.router.navigate(['/teacher/detail-exam', this.examId]);
  }
}
