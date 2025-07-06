import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/requests/register.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  roleId: number = 1;
  passwordVisible: boolean = false;
  availableRoles: any[] = [];
  isLoading: boolean = false;
  form: FormGroup;
  passwordError: string = '';
  confirmPasswordError: string = '';
  emailError: string = '';
  fullNameError: string = '';
  notificationMessage: string = '';
  notificationType: 'success' | 'warning' | 'error' = 'success';
  notificationTitle: string = '';
  showNotification: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.loadAvailableRoles();
  }

  loadAvailableRoles() {
    this.userService.getAvailableRoles().subscribe({
      next: (roles: any) => {
        this.availableRoles = roles.filter((role: any) => role.name !== 'ADMIN');
        const studentRole = this.availableRoles.find((role: any) => role.name === 'STUDENT');
        if (studentRole) {
          this.roleId = studentRole.id;
        }
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  register() {
    this.fullNameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.notificationMessage = '';
    this.notificationType = 'success';
    this.notificationTitle = '';
    this.showNotification = false;

    if (this.form.invalid) {
      const fullNameCtrl = this.form.get('fullName');
      const emailCtrl = this.form.get('email');
      const passwordCtrl = this.form.get('password');
      const confirmPasswordCtrl = this.form.get('confirmPassword');
      if (fullNameCtrl?.hasError('required')) {
        this.fullNameError = 'Họ tên không được để trống';
      }
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
      if (confirmPasswordCtrl?.hasError('required')) {
        this.confirmPasswordError = 'Nhập lại mật khẩu không được để trống';
      } else if (this.form.hasError('passwordsMismatch')) {
        this.confirmPasswordError = 'Nhập lại mật khẩu không khớp';
      }
      return;
    }

    this.isLoading = true;
    const registerDTO: RegisterDTO = {
      full_name: this.form.value.fullName,
      email: this.form.value.email,
      password: this.form.value.password,
      role_id: this.roleId
    };
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.notificationType = 'success';
        this.notificationTitle = 'Thành công';
        this.notificationMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error: any) => {
        this.isLoading = false;
        const errorMessage = error?.error?.error || error?.error || 'Đăng ký thất bại';
        this.notificationType = 'error';
        this.notificationTitle = 'Lỗi';
        this.notificationMessage = errorMessage;
        this.showNotification = true;
        setTimeout(() => this.showNotification = false, 2500);
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  closeNotification() {
    this.showNotification = false;
  }
}
