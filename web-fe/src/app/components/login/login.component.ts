import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { LoginDTO } from '../../dtos/requests/login.dto';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';

  form: FormGroup;

  showNotification: boolean = false;
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationTitle: string = '';
  notificationMessage: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      const token = params['token'];
      if (token) {
        this.handleOAuthCallback(token);
      }
    });
  }

  login() {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';
    this.showNotification = false;

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
        this.showNotification = true;
        this.notificationType = 'success';
        this.notificationTitle = 'Thành công';
        this.notificationMessage = 'Đăng nhập thành công!';
        setTimeout(() => {
          this.showNotification = false;
        this.handleLoginSuccess(token);
        }, 1200);
      },
      error: (error: any) => {
        debugger
        const errorMessage = error?.error?.error || error?.error || 'Đăng nhập thất bại';
        this.showNotification = true;
        this.notificationType = 'error';
        this.notificationTitle = 'Lỗi';
        if (errorMessage.includes('không tồn tại')) {
          this.emailError = 'Email không tồn tại';
          this.notificationMessage = 'Email không tồn tại';
        } else if (errorMessage.includes('không chính xác')) {
          this.loginError = 'Email hoặc mật khẩu không chính xác';
          this.notificationMessage = 'Email hoặc mật khẩu không chính xác';
        } else {
          this.loginError = errorMessage;
          this.notificationMessage = errorMessage;
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

  loginWithGoogle() {
    try {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    } catch (error) {
      console.error('Lỗi khi đăng nhập Google:', error);
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationTitle = 'Lỗi';
      this.notificationMessage = 'Có lỗi xảy ra khi đăng nhập Google. Vui lòng thử lại.';
    }
  }

  private handleLoginSuccess(token: string) {
    try {
      this.tokenService.saveToken(token);
      this.userService.saveUserData(token);
      const payload = this.tokenService.getDecodedToken();
      const currentRole = payload?.currentRole;
    
      if (currentRole === 'TEACHER') {
        this.router.navigate(['/teacher/dashboard']);
      } else if (currentRole === 'STUDENT') {
        this.router.navigate(['/student/dashboard']);
      } else if (currentRole === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý đăng nhập:', error);
      this.loginError = 'Có lỗi xảy ra khi xử lý đăng nhập. Vui lòng thử lại.';
    }
  }

  private handleOAuthCallback(token: string) {
    try {
      this.showNotification = true;
      this.notificationType = 'success';
      this.notificationTitle = 'Thành công';
      this.notificationMessage = 'Đăng nhập Google thành công!';
      setTimeout(() => {
        this.showNotification = false;
      this.handleLoginSuccess(token);
      }, 1200);
    } catch (error) {
      console.error('Lỗi khi xử lý OAuth callback:', error);
      this.showNotification = true;
      this.notificationType = 'error';
      this.notificationTitle = 'Lỗi';
      this.notificationMessage = 'Có lỗi xảy ra khi xử lý đăng nhập Google. Vui lòng thử lại.';
    }
  }

  onNotificationClose() {
    this.showNotification = false;
  }
}
