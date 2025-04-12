import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../services/question.service';
import { QuestionDTO } from '../../../../dtos/question.dto';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnswerService } from '../../../../services/answer.service';

@Component({
  selector: 'app-add-question',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.scss'
})
export class AddQuestionComponent {
  selectedAnswerIndex: number | null = null;
  examId!: number;

  questionDTO: QuestionDTO = {
    question_text: '',
    type: 'MULTI_CHOICE',
    exam_id: 0,
    point: 1,
    answers: [
      {
        answer_text: '',
        is_correct: false,
        question_id: 0,

      }
    ]
  };

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private answerService: AnswerService,
    private router: Router
  ) { }

  ngOnInit() {
    debugger
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.questionDTO.exam_id = this.examId;
  }


  addAnswer() {
    this.questionDTO.answers.push({
      answer_text: '',
      is_correct: false,
      question_id: 0,
    });
  }


  removeAnswer(index: number) {
    this.questionDTO.answers.splice(index, 1);
    if (this.selectedAnswerIndex === index) {
      this.selectedAnswerIndex = null;
    }
  }

  saveQuestion() {
    if (!this.isValidQuestion()) {
      debugger
      alert("Phải có ít nhất một đáp án đúng và không được để trống nội dung!");
      return;
    }

    if (this.questionDTO.type === 'SINGLE_CHOICE') {
      debugger
      this.questionDTO.answers.forEach((answer, i) => {
        answer.is_correct = (i === this.selectedAnswerIndex);
      });
    }

    if (this.questionDTO.type === 'ESSAY') {
      debugger
      this.questionDTO.answers = [{
        answer_text: this.questionDTO.answers[0].answer_text,
        is_correct: true,
        question_id: 0
      }];
    }

    this.questionService.addQuestion(this.questionDTO).subscribe({
      next: (response) => {
        debugger
        alert("Thêm câu hỏi thành công!");
        this.resetForm();
        this.router.navigate(['/teacher/detail-exam/', this.examId]);
      },
      error: (error) => {
        debugger
        alert("Lỗi khi thêm câu hỏi: " + error.error);
      }
    });
  }


  isValidQuestion(): boolean {
    if (this.questionDTO.type === 'MULTI_CHOICE') {
      const hasCorrectAnswer = this.questionDTO.answers.some(answer => answer.is_correct);
      const allAnswersFilled = this.questionDTO.answers.every(answer => answer.answer_text.trim() !== "");

      return hasCorrectAnswer && allAnswersFilled;
    } else if (this.questionDTO.type === 'ESSAY') {
      return (
        this.questionDTO.answers.length === 1 &&
        this.questionDTO.answers[0].answer_text.trim() !== ""
      );
    }



    return true;
  }


  resetForm() {
    this.questionDTO = {
      question_text: '',
      type: 'MULTI_CHOICE',
      exam_id: this.examId,
      point: 0,
      answers: [
        {
          answer_text: '',
          is_correct: false,
          question_id: 0,
        },
      ]
    };
  }
}
