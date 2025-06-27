import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpUtilService } from './http.util.service';
import { RegisterDTO } from '../dtos/requests/register.dto';
import { Observable } from 'rxjs';
import { LoginDTO } from '../dtos/requests/login.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiAvailableRoles = `${environment.apiBaseUrl}/users/available-roles`;
  private apiSwitchRole = `${environment.apiBaseUrl}/users/switch-role`;
  private apiCurrentRole = `${environment.apiBaseUrl}/users/current-role`;
  private apiUserRoles = `${environment.apiBaseUrl}/users/roles`;
  private apiAddRole = `${environment.apiBaseUrl}/users/add-role`;
  private apiRemoveRole = `${environment.apiBaseUrl}/users/remove-role`;

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    private tokenService: TokenService
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

  getAvailableRoles(): Observable<any> {
    return this.http.get(this.apiAvailableRoles, this.getApiConfig());
  }

  switchRole(email: string, newRole: string): Observable<any> {
    const switchRoleDTO = { email, newRole };
    return this.http.post(this.apiSwitchRole, switchRoleDTO, this.getApiConfig());
  }

  getCurrentRole(email: string): Observable<any> {
    return this.http.get(`${this.apiCurrentRole}?email=${email}`, this.getApiConfig());
  }

  getUserRoles(email: string): Observable<any> {
    return this.http.get(`${this.apiUserRoles}?email=${email}`, this.getApiConfig());
  }

  addRoleToUser(email: string, roleName: string): Observable<any> {
    return this.http.post(`${this.apiAddRole}?email=${email}&roleName=${roleName}`, {}, this.getApiConfig());
  }

  removeRoleFromUser(email: string, roleName: string): Observable<any> {
    return this.http.delete(`${this.apiRemoveRole}?email=${email}&roleName=${roleName}`, this.getApiConfig());
  }

  saveUserData(token: string): void {
    if (!token) {
      console.error("Lỗi: Token không tồn tại!");
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        id: payload.id,
        email: payload.email,
        currentRole: payload.currentRole,
        allRoles: payload.allRoles,
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

  getCurrentUserRole(): string | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.currentRole ? parsedData.currentRole : null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy currentRole từ localStorage:", error);
    }
    return null;
  }

  getUserEmail(): string | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.email ? parsedData.email : null;
      }
    } catch (error) {
      console.error("Lỗi khi lấy email từ localStorage:", error);
    }
    return null;
  }
  
  getStudentById(id: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/users/student/${id}`, this.getApiConfig());
  }

  getStudentByIdFromToken(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) throw new Error("User ID not found!");
  
    return this.getStudentById(userId);
  }

  switchRoleAndNavigate(email: string, newRole: string): Observable<any> {
    return this.switchRole(email, newRole);
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return token !== null;
  }

  getUserData(): any {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Lỗi khi lấy user data từ localStorage:", error);
      return null;
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    localStorage.removeItem('user');
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/users/${id}`, this.getApiConfig());
  }

  updateUser(id: number, data: any): Observable<any> {
    const formData = new FormData();
    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (data.email) formData.append('email', data.email);
    if (data.gender !== undefined && data.gender !== null) formData.append('gender', String(data.gender));
    if (data.dob) formData.append('dob', data.dob);
    if (data.avatar) formData.append('avatar', data.avatar);

    // Tạo headers riêng cho FormData, không set Content-Type để Angular tự động set
    const headers = new HttpHeaders({
      'Accept-Language': 'vi',
    });

    return this.http.put(
      `${environment.apiBaseUrl}/users/${id}`,
      formData,
      { headers }
    );
  }
}
