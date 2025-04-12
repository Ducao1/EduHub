import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AssignmentDTO } from '../dtos/assignment.dto';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiAddAssignment = `${environment.apiBaseUrl}/assignments/add`;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
    };
  }
  getAssignmentsByTeacherId(teacherId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/assignments/teacher/${teacherId}`);
  }


  getAssignmentsByClassId(classId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/assignments/class/${classId}`);
  }

  addAssignment(assignmentDTO: AssignmentDTO): Observable<any> {
    return this.http.post(this.apiAddAssignment, assignmentDTO, this.getApiConfig());
  }

  getAssignmentById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/assignments/${id}`);
  }
}
