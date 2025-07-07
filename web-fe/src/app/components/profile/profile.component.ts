import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  loading = true;
  error: string | null = null;
  avatarFile: File | null = null;
  avatarPreviewUrl: string | null = null;
  notification: { type: 'success' | 'warning' | 'error', title: string, message: string } | null = null;
  selectedTab: 'profile' | 'password' = 'profile';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  passwordSuccess: string = '';
  showNotification: boolean = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationTitle: string = '';
  notificationMessage: string = '';

  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (res: User) => {
          debugger
          this.user = res;
          if (this.user.dob) {
            this.user.dob = this.formatDateForInput(this.user.dob);
          }
          if (this.user.avatar) {
            this.avatarPreviewUrl = this.user.avatar.startsWith('http')
              ? this.user.avatar
              : `http://localhost:8080${this.user.avatar}`;
          }
          this.loading = false;
        },
        error: (err) => {
          debugger
          this.error = err;
          this.loading = false;
        }
      });
    }
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatarFile = file;
      this.avatarPreviewUrl = URL.createObjectURL(file);
    }
  }

  updateUser() {
    debugger
    const userId = this.userService.getUserId();
    if (!userId) return;
    const updateData = {
      fullName: this.user.fullName,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      gender: this.user.gender,
      dob: this.user.dob,
      avatar: this.avatarFile
    };
    this.userService.updateUser(userId, updateData).subscribe({
      next: (res) => {
        this.notification = { type: 'success', title: 'Completed', message: 'Cập nhật thành công!' };
        setTimeout(() => this.notification = null, 3000);
        window.location.reload();
      },
      error: (err) => {
        debugger
        this.notification = { type: 'error', title: 'Failed', message: 'Cập nhật thất bại!' };
        setTimeout(() => this.notification = null, 3000);
      }
    });
  }

  selectTab(tab: 'profile' | 'password') {
    this.selectedTab = tab;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  changePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';
    const userId = this.userService.getUserId();
    if (!userId) {
      this.passwordError = 'Không xác định được người dùng!';
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationTitle = 'Lỗi';
      this.notificationMessage = 'Không xác định được người dùng!';
      return;
    }
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Vui lòng nhập đầy đủ thông tin.';
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationTitle = 'Lỗi';
      this.notificationMessage = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordError = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationTitle = 'Lỗi';
      this.notificationMessage = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Xác nhận mật khẩu không khớp.';
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationTitle = 'Lỗi';
      this.notificationMessage = 'Xác nhận mật khẩu không khớp.';
      return;
    }
    this.userService.changePassword(userId, this.oldPassword, this.newPassword).subscribe({
      next: (res: any) => {
        this.passwordSuccess = res.message || 'Đổi mật khẩu thành công!';
        this.showNotification = true;
        this.notificationType = 'success';
        this.notificationTitle = 'Thành công';
        this.notificationMessage = res.message || 'Đổi mật khẩu thành công!';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err: any) => {
        this.passwordError = err?.error?.error || 'Đổi mật khẩu thất bại!';
        this.showNotification = true;
        this.notificationType = 'error';
        this.notificationTitle = 'Lỗi';
        this.notificationMessage = err?.error?.error || 'Đổi mật khẩu thất bại!';
      }
    });
  }

  closeNotification() {
    this.showNotification = false;
  }

  onBack() {
    this.location.back();
  }
}
