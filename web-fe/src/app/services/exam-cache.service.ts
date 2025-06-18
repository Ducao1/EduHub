import { Injectable } from '@angular/core';
import { Exam } from '../interfaces/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamCacheService {
  private readonly CACHE_KEY_PREFIX = 'exam_';
  private readonly TTL = 60 * 60 * 1000;
  private readonly ANSWER_CACHE_KEY_PREFIX = 'exam_answers_';

  setExam(examId: number, exam: Exam): void {
    const cacheData = {
      exam: exam,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${this.CACHE_KEY_PREFIX}${examId}`, JSON.stringify(cacheData));
  }

  getExam(examId: number): Exam | null {
    const cached = localStorage.getItem(`${this.CACHE_KEY_PREFIX}${examId}`);
    if (cached) {
      const cacheData = JSON.parse(cached);
      if (Date.now() - cacheData.timestamp < this.TTL) {
        return cacheData.exam;
      } else {
        localStorage.removeItem(`${this.CACHE_KEY_PREFIX}${examId}`); // Xóa cache hết hạn
      }
    }
    return null;
  }

  clearExam(examId: number): void {
    localStorage.removeItem(`${this.CACHE_KEY_PREFIX}${examId}`);
  }

  setAnswers(examId: number, answers: { single: any, multiple: any }): void {
    localStorage.setItem(
      `${this.ANSWER_CACHE_KEY_PREFIX}${examId}`,
      JSON.stringify(answers)
    );
  }

  getAnswers(examId: number): { single: any, multiple: any } | null {
    const cached = localStorage.getItem(`${this.ANSWER_CACHE_KEY_PREFIX}${examId}`);
    return cached ? JSON.parse(cached) : null;
  }

  clearAnswers(examId: number): void {
    localStorage.removeItem(`${this.ANSWER_CACHE_KEY_PREFIX}${examId}`);
  }
}