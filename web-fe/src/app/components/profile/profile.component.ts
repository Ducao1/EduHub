import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

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

  constructor(private userService: UserService, private location: Location) { }

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
      },
      error: (err) => {
        debugger
        this.notification = { type: 'error', title: 'Failed', message: 'Cập nhật thất bại!' };
        setTimeout(() => this.notification = null, 3000);
      }
    });
  }

  onBack() {
    this.location.back();
  }
}
