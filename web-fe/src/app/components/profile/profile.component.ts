import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (response) => {
          debugger
          this.user = response;
          this.loading = false;
        },
        error: (err) => {
          debugger
          this.error = 'Không thể tải thông tin người dùng';
          this.loading = false;
        }
      });
    }
  }
}
