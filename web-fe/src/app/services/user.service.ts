import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpUtilService } from './http.util.service';
import { RegisterDTO } from '../dtos/register.dto';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dtos/login.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) { }

  private getApiConfig() {
    return {
      headers: this.httpUtilService.createHeaders(),
    };
  }


  register(registerDTO: RegisterDTO): Observable<any>{
    console.log(this.apiRegister);
    return this.http.post(this.apiRegister, registerDTO, this.getApiConfig());
  }
  
  login(loginDTO: LoginDTO): Observable<any> {    
    return this.http.post(this.apiLogin, loginDTO, this.getApiConfig());
  }

  // saveUserData(userData: any): void {
  //   if (!userData || !userData.token) {
  //     console.error("Lỗi: Token không tồn tại!", userData);
  //     return;
  //   }
  //   localStorage.setItem('user', JSON.stringify(userData));
  // }
  saveUserData(token: string): void {
    if (!token) {
      console.error("Lỗi: Token không tồn tại!");
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        id: payload.id,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
        token: token
      };
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error("Lỗi khi phân tích token:", e);
    }
  }
  

  getUserId(): number | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.id ? parsedData.id : null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy userId từ localStorage:", error);
    }
    return null;
  }
  
  getStudentById(id: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/users/student/${id}`);
  }

  getStudentByIdFromToken(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error("Token not found!");
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
  
    return this.getStudentById(userId);
  }
  
}
