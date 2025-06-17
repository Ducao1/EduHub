import { Injectable } from '@angular/core';
import { Exam } from '../interfaces/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamCacheService {
  private readonly CACHE_KEY_PREFIX = 'exam_';
  private readonly TTL = 30 * 60 * 1000; // 30 phút TTL

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
}