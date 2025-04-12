import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { SubmissionService } from '../../../services/submission.service';
import { SubmissionExamDTO } from '../../../dtos/submission-exam.dto';
import { UserService } from '../../../services/user.service';
import { SubmissionAnswerDTO } from '../../../dtos/submission-answer.dto';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './take-exam.component.html',
  styleUrl: './take-exam.component.scss'
})
export class TakeExamComponent {
  exam: any = {};
  examId!: number;
  studentId!: number;
  answers: any[] = [];
  questions: any[] = [];
  timeremaining!: number;
  timerInterval: any;
  singleAnswer: { [key: number]: string } = {};
  essayAnswer: { [key: number]: string } = {};
  multipleAnswers: { [key: number]: string[] } = {};

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private userService: UserService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentId = this.userService.getUserId() ?? 0;
    this.LoadExam();
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  LoadExam() {
    this.examService.getExamById(this.examId).subscribe({
      next: (response) => {
        this.exam = response;
        this.questions = response.questions || [];
        this.timeremaining = response.duration;
        this.timeremaining = Math.floor(response.duration / 1000);
        this.questions.forEach(question => {
          if (question.type === 'SINGLE_CHOICE') {
            this.singleAnswer[question.id] = '';
          } else if (question.type === 'ESSAY') {
            this.essayAnswer[question.id] = '';
          } else if (question.type === 'MULTI_CHOICE') {
            this.multipleAnswers[question.id] = [];
          }
        });

        console.log('Loaded questions:', this.questions);
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        alert(error.error);
      }
    });
  }

  onSingleChoiceChange(questionId: number, answerText: string) {
    if (questionId) {
      this.singleAnswer[questionId] = answerText;
      console.log('Selected answer for question', questionId, ':', answerText);
    }
  }

  onAnswerChange(questionId: number, answerText: string, event: any) {
    if (!this.multipleAnswers[questionId]) {
      this.multipleAnswers[questionId] = [];
    }

    if (event.target.checked) {
      this.multipleAnswers[questionId].push(answerText);
    } else {
      const index = this.multipleAnswers[questionId].indexOf(answerText);
      if (index > -1) {
        this.multipleAnswers[questionId].splice(index, 1);
      }
    }
  }

  submitExam() {
    const answers: SubmissionAnswerDTO[] = [];
  
    for (const questionId in this.singleAnswer) {
      const selectedText = this.singleAnswer[questionId];
      const question = this.questions.find(q => q.id === +questionId);
      const answer = question?.answers.find((a: any) => a.answerText === selectedText);
      if (answer) {
        answers.push({
          question_id: +questionId,
          answer_id: answer.id,
          score: 0,
          submission_id: 0
        });
      }
    }
  
    for (const questionId in this.multipleAnswers) {
      const selectedTexts = this.multipleAnswers[questionId];
      const question = this.questions.find(q => q.id === +questionId);
      selectedTexts.forEach(answerText => {
        const answer = question?.answers.find((a: any) => a.answerText === answerText);
        if (answer) {
          answers.push({
            question_id: +questionId,
            answer_id: answer.id,
            score: 0,
            submission_id: 0
          });
        }
      });
    }
  
    const submissionExamDTO: SubmissionExamDTO = {
      exam_id: this.examId,
      student_id: this.studentId,
      answers: answers
    };
  
    this.submissionService.submitExam(submissionExamDTO).subscribe({
      next: (response) => {
        debugger
        alert(`Điểm: ${response.score}`);
        this.router.navigate(['/student/result-exam', response.id]);
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeremaining > 0) {
        this.timeremaining--;
      } else {
        clearInterval(this.timerInterval);
        this.submitExam();
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeremaining / 60);
    const seconds = this.timeremaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
