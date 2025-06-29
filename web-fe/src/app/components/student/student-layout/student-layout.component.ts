import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-student-layout',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.scss'
})
export class StudentLayoutComponent {
  dropdownOpen = false;
  userId!: number;
  userInfo: User | null = null;

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
    this.router.navigate(['/student/profile', this.userId]);
  }

  switchToTeacher(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = false;
    // TODO: Gọi API/chuyển role sang giáo viên
    console.log('Chuyển sang giáo viên');
  }

  logout(event?: Event) {
    if(event) event.stopPropagation();
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
