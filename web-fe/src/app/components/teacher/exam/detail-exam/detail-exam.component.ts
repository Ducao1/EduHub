import { Component } from '@angular/core';
import { ExamService } from '../../../../services/exam.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../../services/question.service';
import { QuestionDTO } from '../../../../dtos/requests/question.dto';

@Component({
  selector: 'app-detail-exam',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './detail-exam.component.html',
  styleUrl: './detail-exam.component.scss'
})
export class DetailExamComponent {
getDurationMinutes(arg0: any) {
throw new Error('Method not implemented.');
}
addQuestion() {
throw new Error('Method not implemented.');
}
goBack() {
throw new Error('Method not implemented.');
}

  exam: any = {};
  examId!: number;
  teacherId!: number;
  answers: any[] = [];
  questions: any[] = [];
  questionText: string = '';
  type!: string;

  constructor(
    private userService: UserService,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService
  ) { }

  ngOnInit() {
    this.teacherId = this.userService.getUserId() ?? 0;
    this.examId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.examId) {
      this.getExamDetails(this.examId);
    }
  }
  getExamDetails(examId: number) {
    this.examService.getExamById(examId).subscribe({
      next: (response) => {
        debugger
        this.exam = response;
        this.questions = response.questions || [];
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }


  duplicateQuestion(question: any) {
    const questionDTO: QuestionDTO = {
      question_text: question.questionText,
      type: question.type,
      exam_id: this.examId,
      answers: question.answers.map((answer: any) => ({
        answer_text: answer.answerText,
        is_correct: answer.correct,
        question_id: 0
      }))
    };
    this.questionService.addQuestion(questionDTO).subscribe({
      next: (response) => {
        debugger;
        this.getExamDetails(this.examId);
      },
      error: (error) => {
        debugger;
        alert(error.error);
      }
    });
  }

  deleteQuestion(id: number) {
    if (confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      this.questionService.deleteQuestion(id).subscribe({
        next: (response) => {
          debugger
          this.getExamDetails(this.examId);
        },
        error: (error) => {
          debugger
          alert("Xóa câu hỏi thất bại!"+ error.error);
        }
      });
    }
  }
  
  getQuestionType(type: string): string {
    switch (type) {
      case 'SINGLE_CHOICE':
        return 'Một lựa chọn';
      case 'MULTI_CHOICE':
        return 'Nhiều lựa chọn';
      case 'ESSAY':
        return 'Tự luận';
      default:
        return type;
    }
  }

  editExam() {}
}
