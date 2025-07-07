import { Injectable } from '@angular/core';
import { Exam } from '../interfaces/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamCacheService {
  private readonly CACHE_KEY_PREFIX = 'exam_';
  private readonly TTL = 60 * 60 * 1000;
  private readonly ANSWER_CACHE_KEY_PREFIX = 'exam_answers_';
  private readonly ACTIVITY_CACHE_KEY_PREFIX = 'exam_activity_';

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
        localStorage.removeItem(`${this.CACHE_KEY_PREFIX}${examId}`);
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

  setActivityLog(examId: number, classId: number, activities: any[]): void {
    const key = `${this.ACTIVITY_CACHE_KEY_PREFIX}${examId}_${classId}`;
    const cacheData = {
      activities: activities,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  getActivityLog(examId: number, classId: number): any[] | null {
    const key = `${this.ACTIVITY_CACHE_KEY_PREFIX}${examId}_${classId}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      const cacheData = JSON.parse(cached);
      return cacheData.activities;
    }
    return null;
  }

  addActivityToCache(examId: number, classId: number, activity: any): void {
    const key = `${this.ACTIVITY_CACHE_KEY_PREFIX}${examId}_${classId}`;
    const cached = localStorage.getItem(key);
    let activities: any[] = [];
    
    if (cached) {
      const cacheData = JSON.parse(cached);
      activities = cacheData.activities || [];
    }

    activities.unshift(activity);

    if (activities.length > 1000) {
      activities = activities.slice(0, 1000);
    }

    const cacheData = {
      activities: activities,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  clearActivityLog(examId: number, classId: number): void {
    const key = `${this.ACTIVITY_CACHE_KEY_PREFIX}${examId}_${classId}`;
    localStorage.removeItem(key);
  }

  clearAllExamCache(examId: number, classId: number): void {
    this.clearExam(examId);
    this.clearAnswers(examId);
    this.clearActivityLog(examId, classId);
  }
}