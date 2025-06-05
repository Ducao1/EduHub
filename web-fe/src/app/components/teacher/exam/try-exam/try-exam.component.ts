import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, HostListener, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../../services/question.service';
import { ExamService } from '../../../../services/exam.service';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../services/submission.service';

interface Question {
  id: number;
  questionText: string;
  type: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'ESSAY';
  answers: { answerText: string; isCorrect: boolean }[]; // Add isCorrect if needed
  status: 'not-visited' | 'not-answered' | 'answered' | 'marked-for-review' | 'marked-and-answered';
}

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
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  timeremaining!: number;
  timerInterval: any;
  singleAnswer: { [key: number]: string } = {};
  essayAnswer: { [key: number]: string } = {};
  multipleAnswers: { [key: number]: string[] } = {};
  isFullscreen: boolean = false;
  @ViewChildren('questionElement') questionElements!: QueryList<ElementRef>;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private submissionService: SubmissionService
  ) {

  }

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.showConfirmationDialog();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  showConfirmationDialog() {
    const confirmed = confirm('Bạn có muốn bắt đầu làm bài thi? Khi bắt đầu, màn hình sẽ chuyển sang chế độ toàn màn hình để tập trung làm bài.');
    if (confirmed) {
      this.LoadExam();
      this.startTimer();
      setTimeout(() => {
        this.toggleFullscreen();
      }, 500);
    } else {
      window.history.back();
    }
  }

  LoadExam() {
    this.examService.getExamById(this.examId).subscribe({
      next: (response) => {
        debugger
        this.exam = response;
        this.questions = response.questions.map((q: any) => ({
          ...q,
          status: 'not-answered'
        })) || [];
        this.currentQuestionIndex = 0;

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

        console.log('Loaded questions with status:', this.questions);
      },
      error: (error) => {
        debugger
        console.error('Error loading exam:', error);
        alert(error.error);
      }
    });
  }

  goToQuestion(index: number) {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
    }
  }

  onSingleChoiceChange(questionId: number, answerText: string) {
    if (questionId) {
      this.singleAnswer[questionId] = answerText;
      this.updateQuestionStatus(questionId);
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
    this.updateQuestionStatus(questionId);
  }

  updateQuestionStatus(questionId: number) {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      let isAnswered = false;
      if (question.type === 'SINGLE_CHOICE' && this.singleAnswer[questionId] !== '') {
        isAnswered = true;
      } else if (question.type === 'MULTI_CHOICE' && this.multipleAnswers[questionId]?.length > 0) {
        isAnswered = true;
      } else if (question.type === 'ESSAY' && this.essayAnswer[questionId] !== '') {
        isAnswered = true;
      }

      if (question.status !== 'marked-for-review') {
        question.status = isAnswered ? 'answered' : 'not-answered';
      } else {
        question.status = isAnswered ? 'marked-and-answered' : 'marked-for-review';
      }
    }
  }

  getQuestionStatusClass(question: Question): string {
    return question.status;
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
