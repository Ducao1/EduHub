import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  form: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';

    if (this.form.invalid) {
      const emailCtrl = this.form.get('email');
      const passwordCtrl = this.form.get('password');
      if (emailCtrl?.hasError('required')) {
        this.emailError = 'Email không được để trống';
      } else if (emailCtrl?.hasError('email')) {
        this.emailError = 'Email sai định dạng';
      }
      if (passwordCtrl?.hasError('required')) {
        this.passwordError = 'Mật khẩu không được để trống';
      } else if (passwordCtrl?.hasError('minlength')) {
        this.passwordError = 'Mật khẩu có độ dài tối thiểu 8 ký tự';
      }
      return;
    }

    this.tokenService.clearToken();
    const loginDTO: LoginDTO = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {
        debugger
        const token = response.token;
        this.tokenService.saveToken(token);
        this.userService.saveUserData(token);
        const payload = this.tokenService.getDecodedToken();
        const currentRole = payload?.currentRole;
        if (currentRole === 'TEACHER') {
          this.router.navigate(['/teacher/dashboard']);
        } else if (currentRole === 'STUDENT') {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (error: any) => {
        const errorMessage = error?.error?.error || error?.error || 'Đăng nhập thất bại';
        if (errorMessage.includes('không tồn tại')) {
          this.emailError = 'Email không tồn tại';
        } else if (errorMessage.includes('không chính xác')) {
          this.loginError = 'Email hoặc mật khẩu không chính xác';
        } else {
          this.loginError = errorMessage;
        }
      }
    });
  }

  createAccount() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
