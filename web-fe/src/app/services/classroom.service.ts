import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { AddClassDTO } from '../dtos/add-class.dto';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  

  private apiAddClass = `${environment.apiBaseUrl}/classes/add`;

  constructor(private http: HttpClient,
    private userService: UserService
  ) { }

  getClassByTeacher(teacherId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/classes/teacher/${teacherId}`);
  }

  addClass(className: string, description: string): Observable<any> {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("User not logged in");
    }

    const user = JSON.parse(storedUser);
    if (!user.id) {
      throw new Error("Teacher ID not found");
    }

    const addClassDTO = {
      name: className,
      description: description,
      teacher_id: user.id
    };

    return this.http.post(this.apiAddClass, addClassDTO);
  }

  getClassById(classId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/classes/${classId}`);
  }

  getStudentsByClassId(classId: number) {
    throw new Error('Method not implemented.');
  }
}
