import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../services/question.service';
import { ExamService } from '../../../../services/exam.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../services/submission.service';

@Component({
  selector: 'app-try-exam',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './try-exam.component.html',
  styleUrl: './try-exam.component.scss'
})
export class TryExamComponent implements OnInit, OnDestroy {
  exam: any = {};
  examId!: number;
  teacherId!: number;
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
    private submissionService: SubmissionService
  ) {

  }

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
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
        debugger
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
        debugger
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

  submitAnswers() {
    const answers = {
      singleChoice: this.singleAnswer,
      multiChoice: this.multipleAnswers,
      essay: this.essayAnswer
    };
    console.log('Submitting answers:', answers);
    alert("Bài làm đã được gửi!");
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeremaining > 0) {
        this.timeremaining--;
      } else {
        clearInterval(this.timerInterval);
        this.submitAnswers();
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeremaining / 60);
    const seconds = this.timeremaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
