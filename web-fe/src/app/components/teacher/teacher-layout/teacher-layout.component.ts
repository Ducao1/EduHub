import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-teacher-layout',
  imports: [
    CommonModule,
    RouterModule,
    NotificationComponent
  ],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.scss'
})
export class TeacherLayoutComponent {
  dropdownOpen = false;
  userId!: number;
  userInfo: User | null = null;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationMessage: string = '';
  showConfirmSwitchPopup = false;
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ){}
  ngOnInit(){
    this.userId = this.userService.getUserId() ?? 0;
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => this.userInfo = user,
        error: () => this.userInfo = null
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 150); // delay để click chọn menu không bị mất
  }

  viewProfile(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = false;
    this.router.navigate(['/teacher/profile', this.userId]);
  }

  switchToStudent(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = false;
    this.showConfirmSwitchPopup = true;
  }

  cancelSwitchRole() {
    this.showConfirmSwitchPopup = false;
  }

  confirmSwitchToStudent() {
    this.showConfirmSwitchPopup = false;
    const email = this.userInfo?.email;
    if (email) {
      this.userService.switchRole(email, 'STUDENT').subscribe({
        next: (res: any) => {
          if (res.token) {
            debugger
            this.tokenService.saveToken(res.token);
            this.userService.saveUserData(res.token);
            const currentRole = res.currentRole || localStorage.getItem('currentRole') || 'STUDENT';
            this.notificationType = 'success';
            this.notificationMessage = 'Chuyển vai trò thành công!';
            setTimeout(() => {
              this.notificationMessage = '';
              if (currentRole === 'TEACHER') {
                this.router.navigate(['/teacher/dashboard']);
              } else if (currentRole === 'STUDENT') {
                this.router.navigate(['/student/dashboard']);
              } else {
                this.router.navigate(['/']);
              }
            }, 2000);
          }
        },
        error: (err) => {
          debugger
          this.notificationType = 'error';
          this.notificationMessage = 'Chuyển vai trò thất bại: ' + (err.error?.error || err.message);
          setTimeout(() => this.notificationMessage = '', 3000);
        }
      });
    }
  }

  logout(event?: Event) {
    if(event) event.stopPropagation();
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  closeNotification() {
    this.notificationMessage = '';
  }
}
