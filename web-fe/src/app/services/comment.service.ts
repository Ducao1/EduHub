import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpUtilService } from './http.util.service';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiComment = `${environment.apiBaseUrl}/comments`;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  getAllCommentsByClassId(classId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiBaseUrl}/comments/class/${classId}/all`, { 
      headers: this.httpUtilService.createHeaders() 
    });
  }

  createComment(formData: FormData): Observable<Comment> {
    // For FormData, we let the browser set the Content-Type header with the correct boundary.
    // We only need to provide the Authorization header.
    const headers = this.httpUtilService.createHeaders().delete('Content-Type');
    return this.http.post<Comment>(this.apiComment, formData, { headers });
  }

  updateComment(commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiComment}/${commentId}`, { content }, { 
      headers: this.httpUtilService.createHeaders() 
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiComment}/${commentId}`, { 
      headers: this.httpUtilService.createHeaders() 
    });
  }

  likeComment(commentId: number): Observable<any> {
    return this.http.post(`${this.apiComment}/${commentId}/like`, {}, { 
      headers: this.httpUtilService.createHeaders() 
    });
  }

  unlikeComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiComment}/${commentId}/like`, { 
      headers: this.httpUtilService.createHeaders() 
    });
  }
} 