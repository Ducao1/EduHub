import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';

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
