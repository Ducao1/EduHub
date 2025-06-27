import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-teacher-layout',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './teacher-layout.component.html',
  styleUrl: './teacher-layout.component.scss'
})
export class TeacherLayoutComponent {
  dropdownOpen = false;
  userId!: number;
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ){}
  ngOnInit(){
    this.userId = this.userService.getUserId() ?? 0;
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
    // TODO: Gọi API/chuyển role sang học sinh
    console.log('Chuyển sang học sinh');
  }

  logout(event?: Event) {
    if(event) event.stopPropagation();
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
