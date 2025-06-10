import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../services/token.service';

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

  constructor(
    private router: Router,
    private tokenService: TokenService
  ){}
  ngOnInit(){}
  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
