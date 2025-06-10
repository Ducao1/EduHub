import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
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
  currentQuestionIndex: number = 0;
  timeremaining!: number;
  timerInterval: any;
  singleAnswer: { [key: number]: string } = {};
  multipleAnswers: { [key: number]: string[] } = {};
  isFullscreen: boolean = false;
  showConfirmSubmitPopup: boolean = false;

  @ViewChildren('questionElement') questionElements!: QueryList<ElementRef>;

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
      this.LoadExam();
      this.startTimer();
      setTimeout(() => {
        this.toggleFullscreen();
      }, 500);
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
      if (question.type === 'SINGLE_CHOICE') {
        isAnswered = this.singleAnswer[questionId] !== '';
      } else if (question.type === 'MULTI_CHOICE') {
        isAnswered = this.multipleAnswers[questionId]?.length > 0;
      }

      if (question.status !== 'marked-for-review') {
        question.status = isAnswered ? 'answered' : 'not-answered';
      } else {
        question.status = isAnswered ? 'marked-and-answered' : 'marked-for-review';
      }
    }
  }

  getQuestionStatusClass(question: any): string {
    return question.status;
  }

  showConfirmSubmit(): void {
    this.showConfirmSubmitPopup = true;
  }

  cancelSubmit(): void {
    this.showConfirmSubmitPopup = false;
  }

  confirmSubmitExam() {
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
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        console.log(`Điểm: ${response.score}`);
        this.router.navigate(['/result-exam', response.id]);
      },
      error: (error) => {
        debugger
        alert(error.error);
      }
    });
  }

  submitExam() {
    this.showConfirmSubmit();
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
