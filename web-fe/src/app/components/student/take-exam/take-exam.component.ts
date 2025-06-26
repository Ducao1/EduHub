import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, QueryList, ViewChildren, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { SubmissionService } from '../../../services/submission.service';
import { UserService } from '../../../services/user.service';
import { SubmissionAnswerDTO } from '../../../dtos/requests/submission-answer.dto';
import { Subscription } from 'rxjs';
import { ExamStatusType } from '../../../dtos/enums/exam-status-type.enum';
import { SubmissionExamDTO } from '../../../dtos/requests/submission-exam.dto';
import { ExamStatusService } from '../../../services/exam-status.service';
import { ExamCacheService } from '../../../services/exam-cache.service';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-exam.component.html',
  styleUrl: './take-exam.component.scss'
})
export class TakeExamComponent implements OnInit, OnDestroy {
  exam: any = {};
  examId!: number;
  classId!: number;
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
  timeLeft: number = 0;
  timer: any;
  private statusSubscription: Subscription;

  @ViewChildren('questionElement') questionElements!: QueryList<ElementRef>;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private userService: UserService,
    private router: Router,
    private examStatusService: ExamStatusService,
    private examCacheService: ExamCacheService
  ) {
    this.statusSubscription = new Subscription();
  }

  ngOnInit() {
    debugger
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.classId = Number(this.route.snapshot.paramMap.get('classId'));
    this.studentId = this.userService.getUserId() ?? 0;
    if (!this.examId || !this.classId) {
      console.error('examId hoặc classId không hợp lệ:', { examId: this.examId, classId: this.classId });
      alert('Thiếu examId hoặc classId trong URL. Vui lòng kiểm tra lại.');
      this.router.navigate(['/student/dashboard']);
      return;
    }
    this.showConfirmationDialog();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.statusSubscription.unsubscribe();
    this.examStatusService.disconnect();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any) {
    this.sendExamActivity('TAB_CHANGE');
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange() {
    if (!document.fullscreenElement) {
      this.sendExamActivity('FULLSCREEN_EXIT');
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    this.sendExamActivity('EXAM_LEFT');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Lỗi khi bật chế độ toàn màn hình: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  showConfirmationDialog() {
    this.loadExam();
    setTimeout(() => {
      this.toggleFullscreen();
    }, 500);
  }

  loadExam() {
    debugger
    const cachedExam = this.examCacheService.getExam(this.examId);
    if (cachedExam) {
      this.processExamData(cachedExam);
      this.restoreAnswersFromCache();
      this.initializeExamStatus();
      return;
    }

    this.examService.getExamById(this.examId, { classId: this.classId }).subscribe({
      next: (response) => {
        debugger
        this.examCacheService.setExam(this.examId, response);
        this.processExamData(response);
        this.restoreAnswersFromCache();
        this.initializeExamStatus();
      },
      error: (error) => {
        debugger
        console.error('Lỗi khi tải bài thi:', error);
        alert('Không thể tải bài thi. Vui lòng thử lại.');
      }
    });
  }

  private processExamData(response: any) {
    this.exam = response;
    this.questions = response.questions.map((q: any) => ({
      ...q,
      status: 'not-answered'
    })) || [];
    this.currentQuestionIndex = 0;
    this.timeremaining = response.duration || 0;
    this.timeLeft = Math.floor((response.duration || 0) / 1000);
    this.initializeAnswers();

    this.questions.forEach(question => {
      if (question.type === 'SINGLE_CHOICE') {
        this.singleAnswer[question.id] = '';
      } else if (question.type === 'MULTI_CHOICE') {
        this.multipleAnswers[question.id] = [];
      }
    });

    console.log('Đã tải danh sách câu hỏi:', this.questions);
    this.startTimer();
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
      console.log('Đã chọn đáp án cho câu hỏi', questionId, ':', answerText);
      this.saveAnswersToCache();
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
    this.saveAnswersToCache();
  }

  updateQuestionStatus(questionId: number) {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      let isAnswered = false;
      if (question.type === 'SINGLE_CHOICE') {
        isAnswered = !!this.singleAnswer[questionId] && this.singleAnswer[questionId] !== '';
      } else if (question.type === 'MULTI_CHOICE') {
        isAnswered = Array.isArray(this.multipleAnswers[questionId]) && this.multipleAnswers[questionId].length > 0;
      }
        question.status = isAnswered ? 'answered' : 'not-answered';
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
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        this.examStatusService.updateStatus(this.examId, this.studentId, ExamStatusType.SUBMITTED, this.classId);
        this.examCacheService.clearAllExamCache(this.examId, this.classId);
        console.log(`Điểm: ${response.score}`);
        this.router.navigate(['/result-exam', response.id]);
      },
      error: (error) => {
        console.error('Lỗi khi nộp bài:', error);
        alert('Không thể nộp bài. Vui lòng thử lại.');
      }
    });
  }

  submitExam() {
    this.showConfirmSubmit();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  getFormattedTime(): string {
  const minutes = Math.floor(this.timeLeft / 60);
  const seconds = this.timeLeft % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

  private initializeAnswers() {
    this.answers = this.exam.questions.map((question: any) => ({
      questionId: question.id,
      selectedAnswerId: null
    }));
  }

  private initializeExamStatus() {
    if (this.studentId) {
      this.examStatusService.updateStatus(this.examId, this.studentId, ExamStatusType.IN_PROGRESS, this.classId);
    }
  }

  onAnswerSelect(questionId: number, answerId: number) {
    const answer = this.answers.find(a => a.questionId === questionId);
    if (answer) {
      answer.selectedAnswerId = answerId;
    }
  }

  private saveAnswersToCache() {
    this.examCacheService.setAnswers(this.examId, {
      single: this.singleAnswer,
      multiple: this.multipleAnswers
    });
  }

  private restoreAnswersFromCache() {
    const cached = this.examCacheService.getAnswers(this.examId);
    if (cached) {
      this.singleAnswer = cached.single || {};
      this.multipleAnswers = cached.multiple || {};
      this.updateAllQuestionStatuses();
    }
  }

  private updateAllQuestionStatuses() {
    this.questions.forEach(question => {
      let isAnswered = false;
      if (question.type === 'SINGLE_CHOICE') {
        isAnswered = !!this.singleAnswer[question.id] && this.singleAnswer[question.id] !== '';
      } else if (question.type === 'MULTI_CHOICE') {
        isAnswered = Array.isArray(this.multipleAnswers[question.id]) && this.multipleAnswers[question.id].length > 0;
      }
      question.status = isAnswered ? 'answered' : 'not-answered';
    });
  }

  private sendExamActivity(activityType: 'FULLSCREEN_EXIT' | 'TAB_CHANGE' | 'EXAM_LEFT') {
    this.examStatusService.sendExamActivity(
      activityType,
      this.examId,
      this.classId,
      this.studentId
    );
  }
}