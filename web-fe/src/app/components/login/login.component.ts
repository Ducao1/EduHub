import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { LoginDTO } from '../../dtos/requests/login.dto';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '0943220885';
  password: string = '123456';
  passwordVisible: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
  ) { }

  login() {
    this.tokenService.clearToken(); // Xóa token và user cũ

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {
        debugger
        const token = response.token;
        this.tokenService.saveToken(token);
        this.userService.saveUserData(token);

        const payload = this.tokenService.getDecodedToken();
        const role = payload?.role;

        if (role === 'TEACHER') {
          this.router.navigate(['/teacher/dashboard']);
        } else if (role === 'STUDENT') {
          this.router.navigate(['/student/dashboard']);
        } else {
          alert('Vai trò không hợp lệ!');
        }
      },
      error: (error: any) => {
        debugger
        alert(error?.error || 'Đăng nhập thất bại');
      }
    });
  }
  
  
  

  createAccount() {
    debugger
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
